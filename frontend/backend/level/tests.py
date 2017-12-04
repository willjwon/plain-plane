from django.test import TestCase
from .models import Level


class LevelTest(TestCase):
    def setUp(self):
        Level.objects.create(flavor="Plain Yogurt",
                             plane_life_span=123,
                             max_today_write=3,
                             max_today_reply=5,
                             next_level_likes=10)

    def test_model_is_created(self):
        level = Level.objects.get(flavor="Plain Yogurt")
        self.assertEqual(level.flavor, "Plain Yogurt")
        self.assertEqual(level.plane_life_span, 123)
        self.assertEqual(level.max_today_write, 3)
        self.assertEqual(level.max_today_reply, 5)
        self.assertEqual(level.next_level_likes, 10)
