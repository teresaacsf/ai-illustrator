import yake
doc = """

"""
kw_extractor = yake.KeywordExtractor()
keywords = kw_extractor.extract_keywords(doc)
for kw in keywords:
  print(kw[0])