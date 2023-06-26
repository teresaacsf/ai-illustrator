import textrazor
import numpy as np

textrazor.api_key = "e6e0e4189f8f6985a883009209470e51bcada7513fa1b410bb06438c"

text = """




"""

client = textrazor.TextRazor(extractors=["entities","topics"])
response = client.analyze(text)

for entity in response.entities():
    print(entity.id)
