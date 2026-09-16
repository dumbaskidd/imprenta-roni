import re
import sys

def main():
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Replace title and text
    html = html.replace('Nuestros artículos más vendidos', '¡Solicita tus diseños digitales 100% online!')
    html = html.replace('Elige entre más de 250 productos para tu marca.', 'Nuestros diseños 100% personalizados funcionan con las mejores marcas. ¿Qué esperas para el tuyo?')

    # Find the carousel items container
    start_str = '<div class="wd-carousel-wrap">'
    end_str = '</div></div></div></div></div></div></div></div><div class="vc_row wpb_row'
    
    start_idx = html.find(start_str)
    if start_idx == -1:
        print("Could not find start of carousel.")
        return
        
    end_idx = html.find(end_str, start_idx)
    if end_idx == -1:
        end_idx = html.find('</div></div></div></div></div>', start_idx)
        if end_idx == -1:
            print("Could not find end of carousel.")
            return

    # Create new items
    brands = [
        {"name": "Crypto.com", "img": "images/crypto.png", "review": "¡Un trabajo impecable! Lograron capturar la esencia de la marca, los detalles y la seguridad que queríamos transmitir. 10/10."},
        {"name": "Lemon Cash", "img": "images/lemon.png", "review": "El diseño superó nuestras expectativas. Excelente comunicación y entregables de primer nivel. ¡Totalmente recomendados!"},
        {"name": "Tiendas Mass", "img": "images/mass.png", "review": "Muy profesionales. El diseño que nos entregaron se adaptó perfecto a nuestra identidad visual de forma rápida y efectiva."},
        {"name": "UPC", "img": "images/upc.png", "review": "Innovación y calidad en un solo servicio. El equipo entendió nuestras necesidades educativas a la perfección."}
    ]

    new_items_html = ""
    for brand in brands:
        new_items_html += f'''<div class="wd-carousel-item"><div class="wd-product wd-hover-icons product-grid-item product" style="text-align:center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div class="wd-product-wrapper product-wrapper">
                <div class="wd-product-thumb product-element-top">
                    <img src="{brand['img']}" alt="{brand['name']}" style="width:100%; height:250px; object-fit:contain; border-radius: 8px;">
                </div>
                <div class="product-element-bottom">
                    <h3 class="wd-entities-title" style="margin-top: 15px; font-weight: bold; font-size: 1.2rem;">{brand['name']}</h3>
                    <div class="star-rating" style="color: #FFD700; font-size: 1.5rem; margin: 10px 0;">
                        &#9733;&#9733;&#9733;&#9733;&#9733;
                    </div>
                    <p style="font-style: italic; color: #555; font-size: 0.95rem;">"{brand['review']}"</p>
                </div>
            </div>
        </div></div>'''

    new_html = html[:start_idx + len(start_str)] + new_items_html + html[end_idx:]

    # Save to index.html
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    print("Successfully updated index.html")

if __name__ == "__main__":
    main()
