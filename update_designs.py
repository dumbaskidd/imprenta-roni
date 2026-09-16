import re

def main():
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html = f.read()
            
        # 1. Update columns to 2
        # It looks like: style="--wd-col-lg:4;--wd-col-md:2;--wd-col-sm:1;--wd-gap-lg:30px;--wd-gap-sm:30px;"
        html = re.sub(r'--wd-col-lg:\s*4\s*;', '--wd-col-lg:2;', html)
        
        # 2. Fix the stars
        # Currently it's: &#9733;&#9733;&#9733;&#9733;&#9733;
        # We will replace it with FontAwesome stars
        fa_stars = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>'
        html = html.replace('&#9733;&#9733;&#9733;&#9733;&#9733;', fa_stars)

        # 3. Add new items
        new_brands = [
            {"name": "Crumbl Cookies", "img": "images/crumbl.png", "review": "¡Increíble creatividad! Capturaron perfectamente el estilo visual que buscábamos para nuestra marca. Totalmente recomendados."},
            {"name": "Liquid Death", "img": "images/liquid.png", "review": "Rompedor y fresco. Supieron mantener nuestra identidad rebelde en cada trazo. ¡Un servicio de diseño excepcional!"},
            {"name": "Oatly", "img": "images/oatly.png", "review": "Sostenibilidad y buen diseño de la mano. Nos encantó el resultado final, súper alineado con nuestros valores."},
            {"name": "Seedlip", "img": "images/seedlip.png", "review": "Elegancia y precisión. Lograron transmitir la sofisticación de nuestro producto a través de sus diseños digitales."}
        ]

        new_items_html = ""
        for brand in new_brands:
            new_items_html += f'''<div class="wd-carousel-item"><div class="wd-product wd-hover-icons product-grid-item product" style="text-align:center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div class="wd-product-wrapper product-wrapper">
                <div class="wd-product-thumb product-element-top">
                    <img src="{brand['img']}" alt="{brand['name']}" style="width:100%; height:250px; object-fit:contain; border-radius: 8px;">
                </div>
                <div class="product-element-bottom">
                    <h3 class="wd-entities-title" style="margin-top: 15px; font-weight: bold; font-size: 1.2rem;">{brand['name']}</h3>
                    <div class="star-rating" style="color: #FFD700; font-size: 1.5rem; margin: 10px 0;">
                        {fa_stars}
                    </div>
                    <p style="font-style: italic; color: #555; font-size: 0.95rem;">"{brand['review']}"</p>
                </div>
            </div>
        </div></div>'''

        # We need to insert these new items into the carousel
        # Find where the items end.
        end_idx = html.find('</div></div></div></div></div></div></div></div><div class="vc_row wpb_row')
        if end_idx != -1:
            # find the end of the wd-carousel-wrap
            wrap_end = html.rfind('</div>', 0, end_idx)
            html = html[:end_idx] + new_items_html + html[end_idx:]
            
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Updated index.html successfully")
    except Exception as e:
        print(f"Error processing index.html: {e}")

if __name__ == "__main__":
    main()
