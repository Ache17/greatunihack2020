from django.db import models

# Create your models here.
class Earthquakes(models.Model):
    date = models.CharField(max_length= 100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    magnitude = models.FloatField()

    def __str__(self):
        return f"{self.date};{self.latitude};{self.longitude};{self.magnitude}"

