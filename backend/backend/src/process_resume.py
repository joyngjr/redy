import os
from openai import OpenAI
import json
import logging
from datetime import datetime
from backend.models import Resume, Experience, Project, Skill

logger = logging.getLogger(__name__)

# Function calling helper to ensure LLM response produces vaLid JSON schema
resume_parser_function = {
    "name": "parse_resume",
    "description": "Parse a resume into structured JSON data",
    "parameters": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Name of the person"},
            "email": {"type": "string", "description": "Email address"},
            "phone": {"type": "string", "description": "Phone number"},
            "summary": {"type": "string", "description": "Short summary"},
            "experiences": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "job_title": {"type": "string"},
                        "company": {"type": "string"},
                        "description": {"type": "string"},
                        "start_date": {"type": ["string", "null"], "description": "ISO date or null"},
                        "end_date": {"type": ["string", "null"], "description": "ISO date or null"},
                    },
                    "required": ["job_title", "company"]
                }
            },
            "projects": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "technologies": {"type": "string"},
                    },
                    "required": ["title"]
                }
            },
            "skills": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "proficiency": {"type": "string"},
                    },
                    "required": ["name"]
                }
            }
        },
        "required": ["name"]
    }
}

# Formats prompt sent to the LLM for resume parsing
def construct_prompt(extracted_text):
    return f"""
You are a helpful assistant. Given the following resume text, parse it into JSON with the following schema:

{{
    "name": "...",
    "email": "...",
    "phone": "...",
    "summary": "...",
    "experiences": [
        {{
            "job_title": "...",
            "company": "...",
            "description": "...",
            "start_date": "YYYY-MM-DD",
            "end_date": "YYYY-MM-DD"
        }}
    ],
    "projects": [
        {{
            "title": "...",
            "description": "...",
            "technologies": "..."
        }}
    ],
    "skills": [
        {{
            "name": "...",
            "proficiency": "..."
        }}
    ]
}}

The resume text is:
\"\"\"
{extracted_text}
\"\"\"
"""

def process_response(response):
    def calculate_cost():
        output_tokens = response.usage.completion_tokens
        input_tokens = response.usage.prompt_tokens
        total_cost = (input_tokens * 0.4 / 1000000) + (output_tokens * 1.6 / 1000000)
        logger.info(f"Input tokens: {input_tokens}, Output tokens: {output_tokens}, Total Cost: {total_cost}")

    arguments_json = response.choices[0].message.function_call.arguments
    logger.info("LLM RESPONSE: " + str(arguments_json))
    calculate_cost()
    parsed_data = json.loads(arguments_json)
    return parsed_data

def save_to_db(parsed_data):
    resume = Resume.objects.create(
        name=parsed_data.get('name', ''),
        email=parsed_data.get('email', ''),
        phone=parsed_data.get('phone', ''),
        summary=parsed_data.get('summary', ''),
    )

    for exp in parsed_data.get('experiences', []):
        start_date = exp.get('start_date') or None
        end_date = exp.get('end_date') or None
        Experience.objects.create(
            resume=resume,
            job_title=exp.get('job_title', ''),
            company=exp.get('company', ''),
            description=exp.get('description', ''),
            start_date=datetime.fromisoformat(start_date) if start_date else None,
            end_date=datetime.fromisoformat(end_date) if end_date else None,
        )

    for proj in parsed_data.get('projects', []):
        Project.objects.create(
            resume=resume,
            title=proj.get('title', ''),
            description=proj.get('description', ''),
            technologies=proj.get('technologies', ''),
        )

    for skill in parsed_data.get('skills', []):
        Skill.objects.create(
            resume=resume,
            name=skill.get('name', ''),
            proficiency=skill.get('proficiency', ''),
        )

    return

# Main function used to create LLM call and process response
def process_resume_text(extracted_text):
    try:
        prompt = construct_prompt(extracted_text)

        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant who parses resumes into structured JSON."},
                {"role": "user", "content": prompt}
            ],
            functions=[resume_parser_function],
            function_call={"name": "parse_resume"},
        )

        parsed_data = process_response(response)
        save_to_db(parsed_data)
        return {'status': 'success', 'parsed_data': parsed_data}

    except Exception as e:
        return {'error': str(e)}
