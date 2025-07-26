// nav-component.js
export function renderNav(currentPage = '') {
    const navItems = [
        { href: "index.html", text: "Notícies" },
        { href: "reglas.html", text: "Regles" },
        { 
            text: "Classificacions ▼", 
            subItems: [
                { href: "leaderboard.html", text: "Classificació Pokemon" },
                { href: "leaderboard-entrenadores.html", text: "Classificació Entrenadors" }
            ]
        },
        { 
            text: "Equips ▼", 
            subItems: [
                { href: "equipos-jordi.html", text: "Jordi" },
                { href: "equipos-josep.html", text: "Josep" },
                { href: "equipos-eudald.html", text: "Eudald" }
            ]
        },
        { href: "combates.html", text: "Combats" },
        {
            text: "Tests",
            subItems: [ { href: "clasifiacion-stat.html", text: "Stats"}
            ]
        }

    ];

    return `
    <ul>
        ${navItems.map(item => {
            const isActive = currentPage === item.href || 
                            (item.subItems && item.subItems.some(subItem => currentPage === subItem.href));
            
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            return `
            <li class="${isActive ? 'active' : ''}">
                ${hasSubItems ? `
                    <a href="#" class="dropdown-toggle">${item.text}</a>
                    <ul class="dropdown-menu">
                        ${item.subItems.map(subItem => `
                            <li><a href="${subItem.href}" ${currentPage === subItem.href ? 'class="active"' : ''}>${subItem.text}</a></li>
                        `).join('')}
                    </ul>
                ` : `
                    <a href="${item.href}" ${currentPage === item.href ? 'class="active"' : ''}>${item.text}</a>
                `}
            </li>`;
        }).join('')}
    </ul>`;
}

export function setupNav() {
    const navContainer = document.querySelector('nav');
    if (!navContainer) {
        console.error('No se encontró el contenedor del menú');
        return;
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navContainer.innerHTML = renderNav(currentPage);
    
    // Añadir interactividad al menú desplegable
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.nextElementSibling.classList.toggle('show');
        });
    });
}
