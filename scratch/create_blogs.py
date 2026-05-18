import os
import requests
from pathlib import Path
import json

# Paths to generated images
ARTIFACT_DIR = "/home/ravi/.gemini/antigravity/brain/314cca57-11ce-4d5a-9552-846339239c45"
IMG_GODS = f"{ARTIFACT_DIR}/marble_gods_1779104599995.png"
IMG_BUST = f"{ARTIFACT_DIR}/marble_bust_1779104625304.png"
IMG_ARTISAN = f"{ARTIFACT_DIR}/artisan_crafting_1779104658101.png"
IMG_MAKRANA = f"{ARTIFACT_DIR}/makrana_marble_1779104694591.png"
IMG_MANDIR = f"{ARTIFACT_DIR}/home_mandir_vastu_1779107164220.png"
IMG_BUST_NEW = f"{ARTIFACT_DIR}/custom_bust_artisan_1779107190733.png"

API_BASE = "https://moortindia.api.azure.paisafintech.com"

def get_token():
    print("Getting admin token...")
    res = requests.post(
        f"{API_BASE}/api/admin/token",
        json={"username": "admin", "password": "password123"}
    )
    if not res.ok:
        raise Exception(f"Failed to get token: {res.text}")
    return res.json()["access_token"]

def upload_image(token, path):
    print(f"Uploading {path}...")
    with open(path, "rb") as f:
        res = requests.post(
            f"{API_BASE}/api/uploads/image",
            headers={"Authorization": f"Bearer {token}"},
            files={"file": (Path(path).name, f, "image/png")}
        )
        if not res.ok:
            raise Exception(f"Failed to upload {path}: {res.text}")
        return res.json()["url"]

def create_blog(token, payload):
    print(f"Creating blog: {payload['title']}")
    res = requests.post(
        f"{API_BASE}/api/blog",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        json=payload
    )
    if not res.ok:
        # if slug exists, we can patch it
        if "already exists" in res.text:
            print(f"Blog already exists. Patching {payload['slug']}")
            res = requests.patch(
                f"{API_BASE}/api/blog/{payload['slug']}",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            if not res.ok:
                raise Exception(f"Failed to patch blog: {res.text}")
        else:
            raise Exception(f"Failed to create blog: {res.text}")
    print("Success!")

def main():
    token = get_token()
    
    # Upload images
    url_gods = upload_image(token, IMG_GODS)
    url_bust = upload_image(token, IMG_BUST)
    url_artisan = upload_image(token, IMG_ARTISAN)
    url_makrana = upload_image(token, IMG_MAKRANA)

    # Blog 1: Types of Moortis and Delivery
    blog1 = {
        "title": "Mastering the Divine: The Types of Moortis We Craft & How We Deliver Worldwide",
        "slug": "types-of-moortis-and-worldwide-delivery",
        "author": "Moorti India Artisans",
        "excerpt": "From highly detailed Hindu deities to lifelike busts of loved ones, discover the extensive range of marble sculptures we craft in Jaipur, and learn how we safely ship these masterpieces globally.",
        "cover_image": url_gods,
        "is_published": True,
        "created_at": __import__('datetime').datetime.utcnow().isoformat(),
        "tags": ["Hindu Deities", "Marble Busts", "Worldwide Shipping", "Craftsmanship"],
        "content": f"""<h2>The Divine Art of Marble Moortis</h2>
<p>At Moorti India, we consider stone carving to be a form of profound devotion. For generations, our artisans in Jaipur have been transforming raw marble into exquisite expressions of faith, love, and memory. Our portfolio spans a massive variety of subjects, catering to temples, home altars, and personal memorials across the globe.</p>

<h3>Intricately Carved Hindu Deities</h3>
<p>Our specialization lies in crafting highly detailed marble statues of Hindu gods and goddesses. Whether it is a magnificent 6-foot Ganesha for a temple or an intimate 12-inch Radha Krishna for a home mandir, we bring the divine to life.</p>
<img src="{url_gods}" alt="Hindu Deity in Marble" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0;" />
<p>Our artisans are deeply versed in the <em>Shilpa Shastras</em>—the ancient Indian texts that dictate the exact proportions, postures, and iconography of deities. We meticulously carve every detail, from the delicate folds of their garments to the intricate jewelry adorning them, finishing the pieces with authentic gold painting and semi-precious stone inlays.</p>

<h3>Lifelike Memorial Busts</h3>
<p>Beyond the divine, we specialize in capturing the essence of humanity through our custom marble busts. Losing a loved one is profound, and preserving their memory in everlasting marble is a timeless tradition.</p>
<img src="{url_bust}" alt="Marble Bust of a Loved One" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0;" />
<p>Working from photographs provided by families, our master sculptors spend weeks, sometimes months, refining the facial features, expressions, and textures to achieve striking realism. These busts serve as permanent, elegant tributes to passed away relatives, offering families a tangible connection to their loved ones.</p>

<h2>Secure Worldwide Delivery</h2>
<p>A masterpiece is only complete when it arrives safely at its final destination. We understand that marble is both heavy and fragile. Over the decades, we have perfected our global logistics and packaging process to ensure that your Moorti reaches you in pristine condition, whether you are in London, New York, Sydney, or Dubai.</p>

<h3>Our Packaging Process</h3>
<ul>
    <li><strong>Custom Foam Encapsulation:</strong> The statue is first wrapped in soft materials and then completely encased in high-density expanding foam that molds perfectly to every contour, eliminating any internal movement.</li>
    <li><strong>Wooden Crating:</strong> The foam-encased Moorti is placed inside a robust, custom-built wooden crate that meets international shipping standards (ISPM 15).</li>
    <li><strong>Shock Absorption:</strong> The crate is designed to absorb external shocks and vibrations during air or sea transit.</li>
</ul>
<p>We handle all customs clearances, insurance, and door-to-door logistics. When you order from Moorti India, you receive not just a statue, but absolute peace of mind.</p>"""
    }

    # Blog 2: Craftsmanship and Materials
    blog2 = {
        "title": "The Soul of the Stone: Our Craftsmanship and the Legacy of Makrana Marble",
        "slug": "craftsmanship-and-makrana-marble-legacy",
        "author": "Moorti India Artisans",
        "excerpt": "Take a journey inside our Jaipur workshop. Learn about the traditional hand-carving techniques passed down through generations and why we exclusively use premium Makrana marble for our statues.",
        "cover_image": url_artisan,
        "is_published": True,
        "created_at": __import__('datetime').datetime.utcnow().isoformat(),
        "tags": ["Craftsmanship", "Makrana Marble", "Jaipur Art", "Stone Carving"],
        "content": f"""<h2>The Heartbeat of the Workshop</h2>
<p>In the narrow, dusty lanes of Jaipur, the rhythmic sound of a chisel striking stone echoes like a heartbeat. This is where the magic of Moorti India happens. Our workshop is a sanctuary where tradition thrives, and ancient techniques are kept alive by master craftsmen whose lineage traces back to the artisans who built the majestic forts and palaces of Rajasthan.</p>

<h3>The Craftsmanship: Passed Down Through Generations</h3>
<p>Unlike mass-produced, machine-milled statues, every single Moorti that leaves our workshop is entirely hand-carved. The process requires immense patience, precision, and physical endurance.</p>
<img src="{url_artisan}" alt="Artisan carving marble" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0;" />
<p>Our artisans begin by roughing out the block of stone using heavy hammers and chisels. As the form begins to emerge, the tools become smaller and the strikes become gentler. The final details—the curve of a smile, the texture of a fabric, the intricate patterns of jewelry—are carved using fine, needle-like tools.</p>
<p>The final step is the polishing process, done meticulously by hand using various grades of abrasive stones until the marble achieves a luminous, skin-like glow. This dedication to hand-craftsmanship ensures that every statue is unique and possesses a soul of its own.</p>

<h2>The Medium: Premium Makrana Marble</h2>
<p>The quality of a sculpture is fundamentally tied to the quality of the stone. At Moorti India, we source the finest marble in the world: <strong>Makrana Marble</strong>.</p>
<img src="{url_makrana}" alt="Block of Makrana Marble" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0;" />

<h3>Why Makrana Marble?</h3>
<p>Mined in the town of Makrana in Rajasthan, this marble is legendary. It is the exact same stone used to build the iconic Taj Mahal. Here is why it is the superior choice for our statues:</p>
<ul>
    <li><strong>Purity and Luminosity:</strong> Makrana marble has a high calcium content and lacks impurities, giving it a pristine white color that subtly glows under light.</li>
    <li><strong>Durability:</strong> It is incredibly dense and non-porous. Unlike softer marbles that can yellow or weather over time, Makrana marble retains its brilliant white color and structural integrity for centuries, whether placed indoors or outdoors.</li>
    <li><strong>Carvability:</strong> Despite its density, its fine-grained texture allows our artisans to carve incredibly intricate details without the stone fracturing or chipping unpredictably.</li>
</ul>

<p>When you invest in a piece from Moorti India, you are not just acquiring a statue. You are bringing home a piece of geological history, shaped by the hands of master artisans, designed to last for generations.</p>"""
    }

    create_blog(token, blog1)
    create_blog(token, blog2)

    # Blog 3: Home Mandir Vastu
    blog3 = {
        "title": "Choosing the Perfect Moorti for Your Home Mandir: Vastu Tips & Size Guide",
        "slug": "choosing-moorti-home-mandir-vastu-guide",
        "author": "Moorti India Artisans",
        "excerpt": "Discover how to select the right marble moorti for your home altar. We cover Vastu Shastra placement rules, size recommendations, and why Makrana marble brings the best energy.",
        "is_published": True,
        "created_at": __import__('datetime').datetime.utcnow().isoformat(),
        "tags": ["Vastu Shastra", "Home Mandir", "Ganesh Moorti", "Spiritual Decor"],
        "content": f"""<h2>Bringing Divine Energy to Your Home</h2>
<p>Setting up a home mandir (prayer altar) is a deeply personal and spiritual journey. The Moorti you choose becomes the energetic center of your home, radiating peace, prosperity, and protection. However, selecting the right idol involves more than just aesthetics; according to ancient Indian architectural science, Vastu Shastra, specific rules govern the placement and type of deities.</p>

<h3>Vastu Shastra Tips for Placing Moortis</h3>
<p>To maximize the positive energy in your home, keep these fundamental Vastu principles in mind:</p>
<ul>
    <li><strong>Direction of the Mandir:</strong> The ideal location for your home temple is the North-East corner (Ishan Kone). This direction is associated with spiritual growth and divine energy.</li>
    <li><strong>Facing Direction:</strong> When you pray, you should ideally face East or North. Therefore, the Moorti should be placed so it faces the West or South.</li>
    <li><strong>The Ganesha Rule:</strong> If you are installing a Lord Ganesha idol, ensure the trunk is turned to His left (Vamamukhi). A left-turning trunk represents a calm, peaceful energy ideal for a household, whereas a right-turning trunk requires strict, rigorous daily rituals usually reserved for large temples.</li>
    <li><strong>Material Matters:</strong> Vastu heavily favors natural materials. Pure white Makrana marble is considered highly auspicious because its crystalline structure is believed to absorb and reflect positive vibrations.</li>
</ul>

<img src="{{img_mandir}}" alt="Beautiful Home Mandir with Marble Ganesha" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0; border: 1px solid #e0e0e0;" />

<h3>Choosing the Right Size</h3>
<p>Scale is crucial when selecting a Moorti for your home. An idol that is too large can overwhelm a small space, while one that is too small might get lost in a grand mandir.</p>
<p>For standard home altars located in apartments or compact spaces, we recommend statues between <strong>9 inches and 15 inches</strong> in height. For dedicated pooja rooms in larger homes, <strong>18 inches to 24 inches</strong> creates a majestic, temple-like focal point.</p>

<p>No matter the size, every Moorti carved at Moorti India is crafted to strict Shilpa Shastra proportions to ensure it carries the correct spiritual geometry for your home.</p>"""
    }

    # Blog 4: Custom Marble Busts
    blog4 = {
        "title": "The Significance of Custom Marble Busts: Honoring Loved Ones Forever",
        "slug": "custom-marble-busts-honoring-loved-ones",
        "author": "Moorti India Artisans",
        "excerpt": "A photograph fades, but marble is eternal. Learn how our master artisans turn photographs into breathtaking, lifelike 3D marble busts to memorialize passed away relatives.",
        "is_published": True,
        "created_at": __import__('datetime').datetime.utcnow().isoformat(),
        "tags": ["Custom Busts", "Memorial Statues", "Marble Portraits", "Family Heritage"],
        "content": f"""<h2>A Timeless Tribute</h2>
<p>Losing a loved one is an incredibly profound experience. While photographs and videos help preserve their memory, there is something deeply grounding about a physical, three-dimensional tribute. For centuries, kings and nobility commissioned marble busts to ensure their legacy endured. Today, we bring this timeless art form to families around the world.</p>

<h3>The Journey from Photograph to Stone</h3>
<p>Creating a highly realistic custom marble bust is the pinnacle of sculptural art. It requires not just technical skill, but the emotional intuition to capture a person's unique essence, expression, and spirit from a two-dimensional photograph.</p>

<img src="{{img_bust_new}}" alt="Artisan carving a lifelike marble bust from a photograph" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0; border: 1px solid #e0e0e0;" />

<p>Our process is highly collaborative and meticulous:</p>
<ol>
    <li><strong>Photographic Review:</strong> We begin by asking families for multiple photographs of the individual from various angles. The more references we have of their profile, smile, and natural posture, the better.</li>
    <li><strong>The Clay Prototype:</strong> Before a single chisel touches stone, our master portrait sculptor creates a full-scale clay model. This allows us to share 360-degree photos and videos with the family, taking feedback and making adjustments to the jawline, eyes, or expression until it is a perfect likeness.</li>
    <li><strong>Carving the Marble:</strong> Once the family approves the clay model, the true carving begins in premium white Makrana marble. This stone's dense, fine grain allows for the incredibly delicate carving required for realistic skin textures, hair, and clothing folds.</li>
    <li><strong>The Final Polish:</strong> The bust is polished by hand to give the marble a soft, lifelike glow.</li>
</ol>

<h3>Why Choose Marble for a Memorial?</h3>
<p>Unlike resin, plaster, or wood, marble is a natural stone that stands the test of time. It does not decay, warp, or fade. A marble bust is an heirloom—a permanent physical connection to an ancestor that will sit proudly in your home for generations to come, offering a serene, dignified presence.</p>"""
    }

    url_mandir = upload_image(token, IMG_MANDIR)
    url_bust_new = upload_image(token, IMG_BUST_NEW)

    blog3["cover_image"] = url_mandir
    blog3["content"] = blog3["content"].format(img_mandir=url_mandir)
    create_blog(token, blog3)

    blog4["cover_image"] = url_bust_new
    blog4["content"] = blog4["content"].format(img_bust_new=url_bust_new)
    create_blog(token, blog4)

if __name__ == "__main__":
    main()
