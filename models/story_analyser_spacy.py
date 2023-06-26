import spacy
from collections import Counter
from string import punctuation
nlp = spacy.load("en_core_web_sm")









def get_hotwords(text):
    result = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN'] 
    doc = nlp(text.lower()) 
    for token in doc:
        if(token.text in nlp.Defaults.stop_words or token.text in punctuation):
            continue
        if(token.pos_ in pos_tag):
            result.append(token.text)
    return result


new_text = """

K. felt the need to get out of there. The atmosphere started to feel very sticky. People suddenly seemed severe to him: Everyone was walking around slowly with their museum gaze and a painted respect on their face.
K. felt the urge to get fresh air, to smoke a cigarette, to get out of this dead place.
He brusquely turned around, nearly ran over a lady that looked oddly similar to the statue of Florence, and he fearfully backed away to the exit door on the other side.
While walking out, K. noticed that the rain stopped and that the sun had come out during his museum visit. It was playfully reflecting off the still wet surfaces and everything around him looked clean and fresh and hopeful.
K. turned the corner abruptly and his hand reached into his pocket in search for a cigarette.



"""


output = set(get_hotwords(new_text))
most_common_list = Counter(output).most_common(10)
for item in most_common_list:
  print(item[0])



# ./venv/Scripts/activate
