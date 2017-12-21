import json
from os.path import join, dirname
from os import environ
from watson_developer_cloud import VisualRecognitionV3

visual_recognition = VisualRecognitionV3('2016-05-20', api_key = 'api-key')

def isSky(image):
	with open(join(dirname(__file__), '.' + image), 'rb') as image_file:
		visual_recognition_result = visual_recognition.classify(images_file = image_file, threshold = 0, classifier_ids = ['SkyDetection_1096606956'])
		score_info = visual_recognition_result['images'][0]['classifiers'][0]['classes']
		ad = 0
		sky = 0
		for score in score_info:
			if score['class'] == 'ad':
				ad = score['score']
			else:
				sky = score['score']
		if ad < 0.1 and sky > 0.5:
			return True
		else:
			return False