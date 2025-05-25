from django.db import models

class Resume(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    summary = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Experience(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='experiences')
    job_title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.job_title} at {self.company}"

class Project(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    technologies = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.title

class Skill(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=50)
    proficiency = models.CharField(max_length=50, blank=True)  # e.g. beginner, intermediate, advanced

    def __str__(self):
        return self.name
