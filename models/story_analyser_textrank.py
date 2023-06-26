import spacy
import pytextrank


# example text
text = """

He continued and went into the first room where nothing of interest really caught his eye. Only some boring religious sculptures, K. thought to himself. He quickly went out again and since the stone stairway that went to the upper floor looked inviting, he choose that way first. He found himself amongst even more statues. Only the medieval art he saw there charmed him somehow, but nothing really was able to keep his restless mind fixed.
Wandering further he found himself on the lower floor, where a sculpture brought him to a full stop. A strong, young woman with classical features and pointy breasts was pushing a muscular bundle of a man down with her knee and held him captive. The little card informed him that he was looking at Giambologna’s “Florence Triumphant over Pisa”. He was strangely mesmerised by the sheer force, easiness and power that this classical female figure exerted. Her features were all but soft and feminine, at least not in today’s standards. She looks like a man, K. thought to himself. Especially with this nose of hers. 
This allegory of Florence gazed far in the distance and had an odd, frozen facial expression. She didn’t look at all triumphantly, not in the slightest. More kind of bored, cool and aloof, K. noticed.
The sculpture of the captured, older man below, that apparently depicted the town of Pisa, held his hands at the back and they were tied uncomfortably in chains. His gaze was shamefully looking at the floor and K. felt real pity for this expression of ultimate loss on the lifeless face of the sculpture.
He remembered in that moment that he was standing right where the prison of Florence was housed in the 16th century.  Right here, in this severe Bargello building. This was the place of confinement and torture of the era, where people were held in chains and executed. 
Exactly like Mr. Pisa, the sculpture.
K. wondered, if after so many centuries the need for any triumph over prisoners in chains, torture or the death penalty has finally arrived at a saturation point. If there would really be a moment where there could be “triumph” without any chains, without any torture, without any war.
But K. was not at all of a romantic nature. He knew very well that today the depictions or allegories might be showcased different, but that the true sense of triumph will always be the same as it was back then. Even if it is not a female classical figure that usually is the triumphant one.



"""



# load a spaCy model, depending on language, scale, etc.
nlp = spacy.load("en_core_web_sm")
# add PyTextRank to the spaCy pipeline
nlp.add_pipe("textrank")
doc = nlp(text)
# examine the top-ranked phrases in the document
for phrase in doc._.phrases[:10]:
    print(phrase.text)