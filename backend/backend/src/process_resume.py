import os
from openai import OpenAI
import json
import logging
from dotenv import load_dotenv
from django.http import JsonResponse

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

# Overwrites processed resume with parsed data - Allowed since only one avatar connection is enabled at a time
def save_to_file(parsed_data):
    filename = f"data.json"
    dir_path = os.path.join("backend", "src")
    file_path = os.path.join(dir_path, filename)
    logger.info(f"Saving parsed resume to {file_path}")

    # Make directory if it doesn't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, 'w') as f:
        json.dump(parsed_data, f, indent=4)
    
    logger.info(f"Parsed resume saved to {file_path}")
    return file_path

# Main function used to create LLM call and process response
def process_resume_text(extracted_text):
    try:
        prompt = construct_prompt(extracted_text)
        load_dotenv() 
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
        save_to_file(parsed_data)
        return {'status': 'success', 'parsed_data': parsed_data}

    except Exception as e:
        return {'error': str(e)}
