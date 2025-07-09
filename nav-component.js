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
        { href: "combates.html", text: "Combats" }
    ];

    const navHTML = `
    <nav>
        <ul>
            ${navItems.map(item => {
                const isActive = currentPage === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                
                return `
                <li class="${isActive ? 'active' : ''}">
                    ${hasSubItems ? `
                        <a href="#">${item.text}</a>
                        <ul>
                            ${item.subItems.map(subItem => `
                                <li><a href="${subItem.href}" ${currentPage === subItem.href ? 'class="active"' : ''}>${subItem.text}</a></li>
                            `).join('')}
                        </ul>
                    ` : `
                        <a href="${item.href}" ${isActive ? 'class="active"' : ''}>${item.text}</a>
                    `}
                </li>`;
            }).join('')}
        </ul>
    </nav>`;

    return navHTML;
}

export function setupNav() {
    const navContainer = document.querySelector('nav');
    if (navContainer) {
        const currentPage = window.location.pathname.split('/').pop();
        navContainer.innerHTML = renderNav(currentPage);
    }
}
// En nav-component.js
export function setupNav() {
    const navContainer = document.querySelector('nav');
    if (navContainer) {
        const currentPage = window.location.pathname.split('/').pop();
        navContainer.innerHTML = renderNav(currentPage);
        
        // Añadir comportamiento responsive
        const menuItems = document.querySelectorAll('nav > ul > li');
        menuItems.forEach(item => {
            if (item.querySelector('ul')) {
                item.addEventListener('click', (e) => {
                    if (window.innerWidth <= 600) {
                        e.preventDefault();
                        item.classList.toggle('open');
                    }
                });
            }
        });
    }
}
