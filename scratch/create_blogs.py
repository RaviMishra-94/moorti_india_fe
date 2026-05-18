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

if __name__ == "__main__":
    main()
