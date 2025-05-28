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