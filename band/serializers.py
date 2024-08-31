from rest_framework import serializers
from .models import Location, Instrument

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"

    def validate_name(self, value):
        if len(Location.objects.filter(name=value)) > 0:
            raise serializers.ValidationError("duplicate name")
        elif value ==  "":
            raise serializers.ValidationError("blank name")
        return value

class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = "__all__"

    def validate(self, data):
        if len(Instrument.objects.filter(name=data.get("name"), location=data.get("location"))) > 0:
            raise serializers.ValidationError("duplicate name for location")
        elif data.get("name") ==  "":
            raise serializers.ValidationError("blank name")
        return data
    
    def validate_location(self, value):
        if value == "default":
            raise serializers.ValidationError("location required")
        return value