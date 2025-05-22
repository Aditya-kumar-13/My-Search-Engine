import scrapy
import random

class WikipediaSpider(scrapy.Spider):
    name = "wikipedia"

    start_urls = [
        # Core sciences & technology
        "https://en.wikipedia.org/wiki/Science",
        "https://en.wikipedia.org/wiki/Mathematics",
        "https://en.wikipedia.org/wiki/Physics",
        "https://en.wikipedia.org/wiki/Chemistry",
        "https://en.wikipedia.org/wiki/Biology",
        "https://en.wikipedia.org/wiki/Astronomy",
        "https://en.wikipedia.org/wiki/Engineering",
        "https://en.wikipedia.org/wiki/Computer_science",
        "https://en.wikipedia.org/wiki/Information_technology",
        "https://en.wikipedia.org/wiki/Technology",
        # Humanities & arts
        "https://en.wikipedia.org/wiki/Philosophy",
        "https://en.wikipedia.org/wiki/Literature",
        "https://en.wikipedia.org/wiki/Art",
        "https://en.wikipedia.org/wiki/Music",
        "https://en.wikipedia.org/wiki/Film",
        "https://en.wikipedia.org/wiki/Theatre",
        "https://en.wikipedia.org/wiki/History",
        "https://en.wikipedia.org/wiki/Culture",
        "https://en.wikipedia.org/wiki/Architecture",
        # Social sciences
        "https://en.wikipedia.org/wiki/Psychology",
        "https://en.wikipedia.org/wiki/Sociology",
        "https://en.wikipedia.org/wiki/Anthropology",
        "https://en.wikipedia.org/wiki/Economics",
        "https://en.wikipedia.org/wiki/Political_science",
        "https://en.wikipedia.org/wiki/Education",
        "https://en.wikipedia.org/wiki/Geography",
        "https://en.wikipedia.org/wiki/Religion",
        "https://en.wikipedia.org/wiki/Linguistics",
        # Applied sciences and professional fields
        "https://en.wikipedia.org/wiki/Medicine",
        "https://en.wikipedia.org/wiki/Health_care",
        "https://en.wikipedia.org/wiki/Law",
        "https://en.wikipedia.org/wiki/Business",
        "https://en.wikipedia.org/wiki/Marketing",
        "https://en.wikipedia.org/wiki/Finance",
        "https://en.wikipedia.org/wiki/Environmental_science",
        "https://en.wikipedia.org/wiki/Agriculture",
        "https://en.wikipedia.org/wiki/Transportation",
        # Sports & recreation
        "https://en.wikipedia.org/wiki/Sports",
        "https://en.wikipedia.org/wiki/Games",
        "https://en.wikipedia.org/wiki/Video_game",
        "https://en.wikipedia.org/wiki/Outdoor_recreation",
        # Broader interdisciplinary and popular topics
        "https://en.wikipedia.org/wiki/Internet",
        "https://en.wikipedia.org/wiki/Space_exploration",
        "https://en.wikipedia.org/wiki/Climate_change",
        "https://en.wikipedia.org/wiki/Artificial_intelligence",
        "https://en.wikipedia.org/wiki/Robotics",
        "https://en.wikipedia.org/wiki/Cybersecurity",
        "https://en.wikipedia.org/wiki/Philosophy_of_science",
        "https://en.wikipedia.org/wiki/Quantum_mechanics",
        "https://en.wikipedia.org/wiki/Evolutionary_biology",
        "https://en.wikipedia.org/wiki/Cosmology",
        "https://en.wikipedia.org/wiki/Neuroscience",
        "https://en.wikipedia.org/wiki/Ethics",
        "https://en.wikipedia.org/wiki/Journalism",
        "https://en.wikipedia.org/wiki/Communication",
        "https://en.wikipedia.org/wiki/Fashion",
        "https://en.wikipedia.org/wiki/Food",
    ]

    custom_settings = {
        'DEPTH_LIMIT': 3,
        'FEED_EXPORT_ENCODING': 'utf-8',
    }

    def parse(self, response):
        title = response.css('h1#firstHeading span.mw-page-title-main::text').get()

        paragraphs = response.xpath('//div[@id="mw-content-text"]//p[not(@class)]//text()').getall()
        first_paragraph = ' '.join([p.strip() for p in paragraphs if p.strip()])[:1000]

        links = response.xpath(
            '//div[@id="mw-content-text"]//a[starts-with(@href, "/wiki/") and not(contains(@href, ":"))]/@href'
        ).getall()

        links = list(set(response.urljoin(link) for link in links))

        yield {
            'title': title,
            'first_paragraph': first_paragraph,
            'url': response.url,
            'links_count': len(links),
        }

        if links:
            sample_links = random.sample(links, min(10, len(links)))
            for link in sample_links:
                yield scrapy.Request(link, callback=self.parse)
