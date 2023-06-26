from keybert import KeyBERT
doc = """

The brave kids, after quite some time, finally see a crack in between the trees and on the other side, their aunt’s farm. But there was a small problem: There was a river cutting the path, it was not very deep or big, but the water was dark and we could not quite see what was underneath, and considering all the scary stories we had talked about before, we did not want to go and check. We had to make a choice: it was either crossing the river or facing the magical horse again, and we would rather wet our clothes. So we did, after some struggles figuring out how we were supposed to do it, without hesitating, one of us just jumped over the river where it was narrower. And in a beautiful teamwork we managed to help the youngest to jump over, and all of us ran home without ever looking back. I recall some of us having nightmares that night. (04)
"""
kw_model = KeyBERT()
keywords = kw_model.extract_keywords(doc)
print(keywords)