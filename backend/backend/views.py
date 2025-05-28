# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pdfminer.high_level import extract_text
import os
import tempfile

from backend.src.process_resume import process_resume_text

def home(request):
    return JsonResponse({
        "message": "Backend is running!",
    })

@csrf_exempt
def upload_resume(request):
    if request.method == 'POST' and request.FILES.get('resume'):
        uploaded_file = request.FILES['resume']
        
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            for chunk in uploaded_file.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name

        try:
            # Extract text from the PDF file
            extracted_text = extract_text(tmp_file_path)
            response_data = process_resume_text(extracted_text)
        except Exception as e:
            response_data = {'error': str(e)}
        finally:
            # Clean up the temporary file
            os.remove(tmp_file_path)

        return JsonResponse(response_data)

    return JsonResponse({'error': 'Invalid request. Please upload a PDF file.'}, status=400)

@csrf_exempt
def retrieve_resume(request):
    import json
    data_file = os.path.join(os.path.dirname(__file__), 'src', 'data.json')
    if not os.path.exists(data_file):
        return JsonResponse({'error': 'No resume data found. Please upload a resume first.'}, status=404)

    try:
        with open(data_file, 'r') as f:
            data = json.load(f)
        if not data:
            return JsonResponse({'error': 'No resume data found. Please upload a resume first.'}, status=404)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': f'Error reading resume data: {str(e)}'}, status=500)