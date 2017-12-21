from django.test import TestCase
from .models import Level


class LevelTest(TestCase):
    def setUp(self):
        Level.objects.create(flavor="Plain Yogurt",
                             plane_life_span=123,
                             max_today_write=3,
                             max_today_reply=5,
                             next_level_likes=10)

        self.plain = Level(flavor="Plain",
                           plane_life_span=10,
                           max_today_write=10,
                           max_today_reply=10,
                           next_level_likes=10)
        self.plain.save()

        self.strawberry = Level(flavor="Strawberry",
                                plane_life_span=10,
                                max_today_write=10,
                                max_today_reply=10,
                                next_level_likes=10)
        self.strawberry.save()

        self.mango = Level(flavor="Mango",
                           plane_life_span=10,
                           max_today_write=10,
                           max_today_reply=10,
                           next_level_likes=10)
        self.mango.save()

        self.melon = Level(flavor="Melon",
                           plane_life_span=10,
                           max_today_write=10,
                           max_today_reply=10,
                           next_level_likes=10)
        self.melon.save()

        self.blueberry = Level(flavor="Blueberry",
                               plane_life_span=10,
                               max_today_write=10,
                               max_today_reply=10,
                               next_level_likes=10)
        self.blueberry.save()

        self.jasmine = Level(flavor="Jasmine",
                             plane_life_span=10,
                             max_today_write=10,
                             max_today_reply=10,
                             next_level_likes=10)
        self.jasmine.save()

        self.soysauce = Level(flavor="SoySauce",
                              plane_life_span=10,
                              max_today_write=10,
                              max_today_reply=10,
                              next_level_likes=10)
        self.soysauce.save()

    def test_model_is_created(self):
        level = Level.objects.get(flavor="Plain Yogurt")
        self.assertEqual(level.flavor, "Plain Yogurt")
        self.assertEqual(level.plane_life_span, 123)
        self.assertEqual(level.max_today_write, 3)
        self.assertEqual(level.max_today_reply, 5)
        self.assertEqual(level.next_level_likes, 10)

    def test_next_level(self):
        self.assertEqual(Level.get_next_level(self.plain), self.strawberry)
        self.assertEqual(Level.get_next_level(self.strawberry), self.mango)
        self.assertEqual(Level.get_next_level(self.mango), self.melon)
        self.assertEqual(Level.get_next_level(self.melon), self.blueberry)
        self.assertEqual(Level.get_next_level(self.blueberry), self.jasmine)
        self.assertEqual(Level.get_next_level(self.jasmine), self.jasmine)
        self.assertEqual(Level.get_next_level(self.soysauce), self.plain)

    def test_lifespan_in_date_form(self):
        self.assertIsNotNone(self.plain.lifespan_in_date_form())
