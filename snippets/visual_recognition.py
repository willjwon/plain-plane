"""
__Instructions__

1. Watson Developer Cloud should be installed first!
$sudo pip3 install --upgrade watson-developer-cloud

2. insert api key in VisualRecognitionV3.

3. insert file name with relative path.
_______________________________________________________

__Notes__

1. each file should not exceed 2MB.

2. "jpg" and "png" files can be tested.

3. 250 images can be tested per day.

_______________________________________________________

__Additional Information__

1. there are two classes in SkyDetection classifier: ["sky", "ad"].

2. minimum threshold for sky is 0.5 and maximum threshold for ad is 0.1, so used these numbers.

3. sample output:
{
  "custom_classes": 2,
  "images": [
	{
	  "classifiers": [
		{
		  "classifier_id": "SkyDetection_1096606956",
		  "classes": [
			{
			  "score": 0.0538684,
			  "class": "ad"
			},
			{
			  "score": 0.529872,
			  "class": "sky"
			}
		  ],
		  "name": "Sky Detection"
		}
	  ],
	  "image": "./test.jpg"
	}
  ],
  "images_processed": 1
}
"""

import json
from os.path import join, dirname
from os import environ
from watson_developer_cloud import VisualRecognitionV3

visual_recognition = VisualRecognitionV3('2016-05-20', api_key = 'insert-api-key')

with open(join(dirname(__file__), './test.jpg'), 'rb') as image_file:
	print(json.dumps(visual_recognition.classify(images_file = image_file, threshold = 0, classifier_ids = ['SkyDetection_1096606956']), indent = 2))