import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tag import pos_tag
import string
from collections import Counter
from rake_nltk import Rake
import re
import numpy as np


nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('vader_lexicon')
nltk.download('averaged_perceptron_tagger')
nltk.download('universal_tagset')

num_illustrations = 1

# Step 1: Read and Understand the Story
def preprocess_text(text):
    # Remove special characters and lowercase the text
    processed_text = text.lower().replace('\n', ' ').replace('\r', '')

    return processed_text

def tokenize_sentences(text):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    
    return sentences

def lemmatize_words(words):
    # Lemmatize the words
    lemmatizer = WordNetLemmatizer()
    punctuation = set(string.punctuation)
    punctuation.remove("'")  # Remove single quotation mark
    punctuation.remove('"')  # Remove double quotation mark
    specific_characters = set(['’', '‘', '“', '”', '–', ' ', '', '  '])  # Specify the characters to remove


    lemmatized_words = []
    for word in words:
        # Remove punctuation
        word = ''.join(ch for ch in word if ch not in punctuation and ch not in specific_characters)
        # Lemmatize the word
        lemmatized_word = lemmatizer.lemmatize(word)
        if lemmatized_word and lemmatized_word != '':
            lemmatized_words.append(lemmatized_word)

    return lemmatized_words

def perform_pos_tagging(words):
    # Perform part-of-speech tagging
    tagged_words = pos_tag(words, tagset="universal")
    #print(tagged_words)

    return tagged_words

# Step 2: Identify Key Scenes or Moments
def identify_key_scenes(sentences):
    key_scenes = []
    sid = SentimentIntensityAnalyzer()
    s_scores = {}

    for sentence in sentences:
        sentiment_score = sid.polarity_scores(sentence)['compound']
        #print(sentiment_score)
        s_scores[sentence] = np.absolute(sentiment_score)
        # if sentiment_score < -0.5 or sentiment_score > 0.5:
        #     key_scenes.append(sentence)
   
    sorted_s_scores = sorted(s_scores.items(), key=lambda x:x[1], reverse=True)
    #print(sorted_s_scores)
    sorted_s_scores = [item[0] for item in sorted_s_scores]
    sorted_s_scores=sorted_s_scores[:num_illustrations]

    return sorted_s_scores




def extract_named_entities(tagged_words):
    named_entities = []
    for word, pos in tagged_words:
        if pos == 'NOUN':  # Proper Noun
            named_entities.append(word)

    return named_entities

def visualize_scenes(key_scenes):
    for scene in key_scenes:
        print(scene)
        # Add visualization code here based on your preferred approach


short_story = """

The brave kids, after quite some time, finally see a crack in between the trees and on the other side, their aunt’s farm. But there was a small problem: There was a river cutting the path, it was not very deep or big, but the water was dark and we could not quite see what was underneath, and considering all the scary stories we had talked about before, we did not want to go and check. We had to make a choice: it was either crossing the river or facing the magical horse again, and we would rather wet our clothes. So we did, after some struggles figuring out how we were supposed to do it, without hesitating, one of us just jumped over the river where it was narrower. And in a beautiful teamwork we managed to help the youngest to jump over, and all of us ran home without ever looking back. I recall some of us having nightmares that night. (04)
						


"""


# Main function
def analyze_short_story(short_story):
    preprocessed_text = preprocess_text(short_story)
    sentences = tokenize_sentences(preprocessed_text)
    lemmatized_words = lemmatize_words(word_tokenize(preprocessed_text))
    tagged_words = perform_pos_tagging(lemmatized_words)
    key_scenes = identify_key_scenes(sentences)
    named_entities = extract_named_entities(tagged_words)

    #visualize_scenes(key_scenes)
    #print("Named Entities:", named_entities)
    return key_scenes

scenes = analyze_short_story(short_story)
print(scenes)