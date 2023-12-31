-- Add dummy users
INSERT INTO users (username, email, about, password_hash) VALUES
    ('john_doe', 'john@example.com', 'Passionate about technology and gaming.', 'password1'),
    ('alice_smith', 'alice@example.com', 'Art enthusiast and nature lover.', 'password2'),
    ('sam_jones', 'sam@example.com', 'Web developer by profession, foodie by passion.', 'password3'),
    ('emily_white', 'emily@example.com', 'Travel blogger and photography enthusiast.', 'password4'),
    ('david_miller', 'david@example.com', 'Fitness freak and aspiring chef.', 'password5');

-- Add dummy topics
INSERT INTO topics (title, details, some_text) VALUES
    ('Web Development', 'Discuss the latest trends and technologies in web development.', 'Web development is a dynamic field that constantly evolves with new frameworks, languages, and tools. Join our community to stay updated on the latest trends and share your experiences in building innovative web applications. Whether you are a frontend enthusiast, backend developer, or full-stack wizard, this is the place to collaborate and learn from each other.');

INSERT INTO topics (title, details, some_text) VALUES
    ('Art and Design', 'Share your artworks, get feedback, and discuss design principles.', 'Art and design are powerful forms of expression. Whether you are a painter, graphic designer, or multimedia artist, our community provides a platform to showcase your work, receive constructive feedback, and engage in conversations about design principles and techniques.');

INSERT INTO topics (title, details, some_text) VALUES
    ('Travel and Adventure', 'Share your travel experiences and discover new destinations.', "Embark on a journey with fellow travel enthusiasts! Share your memorable travel experiences, exchange tips on planning the perfect itinerary, and discover hidden gems around the world. From backpacking adventures to luxurious getaways, let\'s explore the beauty of our planet together.");

INSERT INTO topics (title, details, some_text) VALUES
    ('Gaming Community', 'Connect with fellow gamers and discuss your favorite games.', "Calling all gamers! Join our vibrant gaming community to connect with like-minded individuals, share your gaming experiences, and discuss everything related to your favorite games. From strategy games to action-packed adventures, let\'s level up together!");

INSERT INTO topics (title, details, some_text) VALUES
    ('Healthy Living', 'Discuss fitness routines, nutrition, and healthy recipes.', 'Achieve your health and wellness goals with our community dedicated to healthy living. Share your fitness routines, exchange nutrition tips, and explore delicious and nutritious recipes. Whether you are a fitness enthusiast or a beginner on the wellness journey, we are here to support each other.');

INSERT INTO topics (title, details, some_text) VALUES
    ('Technology Trends', 'Explore the latest advancements in technology.', "Stay ahead in the fast-paced world of technology! Our community is your hub for exploring the latest tech trends, discussing breakthrough innovations, and sharing insights into the future of technology. Whether you are a tech enthusiast or a seasoned professional, let\'s dive into the fascinating world of tech.");

INSERT INTO topics (title, details, some_text) VALUES
    ('Photography Enthusiasts', 'Share your photography, tips, and tricks.', "Capture the beauty of the world through the lens! Join our photography community to share your stunning captures, exchange tips and tricks with fellow enthusiasts, and explore the art of visual storytelling. Whether you are a seasoned photographer or just getting started, let\'s capture moments together.");


-- Add users to topics in users_topics table
INSERT INTO users_topics (user_id, topic_id) VALUES
    (1, 1),
    (1, 2),
    (1, 5),
    (2, 2),
    (2, 1),
    (3, 3),
    (3, 4),
    (4, 3),
    (4, 5),
    (5, 1),
    (4, 4),
    (5, 5);

-- Add dummy posts with longer content
INSERT INTO posts (user_id, topic_id, title, content) VALUES
    (1, 1, 'Building Responsive Websites', "In this comprehensive guide, we will explore the art and science of building responsive websites that seamlessly adapt to a diverse range of devices and screen sizes. Navigating the ever-evolving landscape of web development, we'll delve into the latest CSS and JavaScript techniques. From media queries to flexible grids, discover best practices for crafting user interfaces that provide an optimal viewing experience. Share your insights, challenges, and success stories in the dynamic world of responsive web design. Whether you are a seasoned developer or just getting started, join the conversation and contribute to the collective knowledge of the web development community."),

    (2, 2, 'Exploring Watercolor Techniques', "Calling all watercolor enthusiasts! Embark on a creative journey as we explore an array of watercolor techniques to elevate your artistic expression. From the magical dance of wet-on-wet blending to the intricate details achievable with dry brush techniques, we'll cover the full spectrum of possibilities. Share your favorite watercolor artworks and the stories behind each piece. Whether you're an experienced watercolorist or a curious beginner, this is the perfect space to exchange ideas, tips, and techniques. Let's create a vibrant community where the beauty of watercolor unfolds in every stroke."),

    (3, 3, 'Backpacking Through Southeast Asia', "Join fellow adventurers as we embark on an immersive exploration of backpacking through the enchanting landscapes of Southeast Asia. This virtual expedition will traverse bustling city streets, lush jungles, and serene beaches. Share your most cherished travel anecdotes, hidden gems, and must-visit destinations. Whether you're a seasoned backpacker with a wealth of experiences or a dreamer planning your first trip, contribute to our collective travelogue. From cultural encounters to culinary delights, let's create a tapestry of memories that inspires wanderlust and guides fellow explorers."),

    (4, 4, 'Favorite RPG Games', "Embark on an epic quest into the captivating world of role-playing games (RPGs). In this discussion, we'll delve into the heart of our favorite RPG titles, exploring the intricate tapestry of storytelling, character development, and immersive gameplay. Share your most memorable gaming experiences, discuss the evolution of RPG mechanics, and unravel the magic behind the captivating storylines. Whether you're a veteran tabletop gamer or a digital adventurer, this forum provides a space to celebrate the rich diversity of RPG experiences that have captured our imaginations."),

    (5, 5, 'High-Protein Recipes', "Indulge your culinary creativity with a curated collection of high-protein recipes designed to nourish and delight. From energizing breakfasts to savory dinners, this forum is a haven for culinary enthusiasts seeking to infuse their meals with protein-packed goodness. Share your go-to recipes, cooking techniques, and tips for crafting meals that are both nutritious and delicious. Whether you're a fitness enthusiast focused on muscle building or someone simply looking to add more protein to your diet, let's ins... to be continued in the next post");



-- Add dummy tags
INSERT INTO tags (tag_name, post_id) VALUES
    ('Web Development', 1),
    ('Design', 2),
    ('Travel', 3),
    ('Gaming', 4),
    ('Healthy Living', 5);

-- Add dummy comments
INSERT INTO replies (user_id, post_id, content) VALUES
    (2, 1, "Great tips! Responsive design is crucial in today\'s web development."),
    (3, 1, "I\'m a beginner in web development. Any tips for getting started?"),
    (4, 1, "I\'m a web developer with 5 years of experience. Happy to help!"),
    (5, 2, "I love experimenting with watercolor. Can\'t wait to share my artworks!"),
    (4, 3, "Southeast Asia is on my bucket list! Any specific countries you recommend?"),
    (1, 4, "Have you tried the latest RPG release? It\'s amazing!"),
    (1, 5, "URGENT: I need to increase my protein intake. Any quick and easy recipes?"),
    (2, 5, "I\'m a vegetarian. Any plant-based protein recipes?"),
    (3, 5, "That protein-packed recipe looks delicious! Going to try it this weekend.");

