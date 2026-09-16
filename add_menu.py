import re

def add_menu_item(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html = f.read()
            
        # Find the main menu (usually ul with class menu or something)
        # Let's search for "Inicio" or "Tienda" link
        match = re.search(r'(<li[^>]*><a[^>]*href="tienda.html"[^>]*>.*?</a></li>)', html, re.IGNORECASE)
        if match:
            new_item = '<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children item-level-0"><a href="productos.html" class="woodmart-nav-link"><span class="nav-link-text">Productos Físicos</span></a></li>'
            html = html[:match.end()] + new_item + html[match.end():]
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Added menu item to {file_path}")
        else:
            print(f"Could not find menu in {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

add_menu_item('index.html')
add_menu_item('productos.html')
