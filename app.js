// Estado de la Aplicación
const state = {
    theme: 'dark', // 'dark', 'light', 'gold'
    hasPhoto: false,
    hasAwards: false, // Pregunta inicial ¿Posee premios?
    agent: {
        name: '',
        cargo: '',
        cargo2: '',
        phone: '',
        address: '3009 23 St NE, Calgary, AB T2E7A4',
        office: 'Bravo Realty' // Dejado para compatibilidad si el logo no carga
    },
    photo: {
        file: null,
        imgElement: null,
        originalImgElement: null,
        mask: 'none', // 'none' (overlay), 'circle', 'rect'
        zoom: 1.0,
        offsetX: 0,
        offsetY: 0
    },
    // Lista completa de los 16 premios oficiales del cliente cargados en la carpeta assets/awards/
    awards: [
        { id: 'masters_ruby', name: 'Masters Ruby', file: 'assets/awards/masters_ruby_en_g.png', enabled: false, isPreset: true },
        { id: 'pacesetter_gold', name: 'Pacesetter Gold', file: 'assets/awards/pacesettergold_en.png', enabled: false, isPreset: true },
        { id: 'centurion', name: 'Centurion', file: 'assets/awards/centurion_en.png', enabled: false, isPreset: true },
        { id: 'double_centurion', name: 'Double Centurion', file: 'assets/awards/doublecenturion_en.png', enabled: false, isPreset: true },
        { id: 'grand_centurion', name: 'Grand Centurion', file: 'assets/awards/grandcenturion_en.png', enabled: false, isPreset: true },
        { id: 'centurion_10yr', name: 'Centurion 10 Years', file: 'assets/awards/centurion_10yr_en_1_.png', enabled: false, isPreset: true },
        { id: 'centurion_21yr', name: 'Centurion 21 Years', file: 'assets/awards/centurion_21yr_en.png', enabled: false, isPreset: true },
        { id: 'centurion_honour_society', name: 'Centurion Honour Society', file: 'assets/awards/c21_canada_centurion_honour_society.png', enabled: false, isPreset: true },
        { id: 'masters_diamond', name: 'Masters Diamond', file: 'assets/awards/masters_diamond_en.png', enabled: false, isPreset: true },
        { id: 'masters_emerald', name: 'Masters Emerald', file: 'assets/awards/masters_emerald_en.png', enabled: false, isPreset: true },
        { id: 'masters_silver', name: 'Masters Silver', file: 'assets/awards/masters_silver_en.png', enabled: false, isPreset: true },
        { id: 'outstanding_achievement', name: 'Outstanding Achievement', file: 'assets/awards/oa_en.png', enabled: false, isPreset: true },
        { id: 'pacesetter_platinum', name: 'Pacesetter Platinum', file: 'assets/awards/pacesetterplatinum_en.png', enabled: false, isPreset: true },
        { id: 'top_1_percent', name: 'Top 1 Percent', file: 'assets/awards/top1percenten_1_.png', enabled: false, isPreset: true },
        { id: 'top_30_under_30', name: 'Top 30 Under 30', file: 'assets/awards/top30under30_logo_en_gold_1_.png', enabled: false, isPreset: true },
        { id: 'long_term_service', name: 'Long Term Service', file: 'assets/awards/longtermservicelogo_final_en_1_.png', enabled: false, isPreset: true }
    ],
    socials: {
        facebook: '',
        instagram: '',
        website: ''
    },
    bannerHostedUrl: ''
};

// Caché de imágenes cargadas para evitar recargas constantes y guardar iconos base64
const imageCache = {};
const socialIconsBase64 = {};
const customSocialPaths = {
    facebook: 'assets/social/Facebook.png',
    instagram: 'assets/social/Instagram.png',
    website: 'assets/social/web.png'
};
const hostedSocialUrls = {
    facebook: '',
    instagram: '',
    website: ''
};

// Elementos de la Interfaz
const canvas = document.getElementById('bannerCanvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('bannerForm');

// Inicialización de la Aplicación
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar la tipografía Barlow antes de dibujar
    if (document.fonts) {
        await document.fonts.ready;
    }
    
    // 2. Generar iconos de redes sociales dorados en Base64
    generateSocialIconsBase64();
    
    // Cargar iconos de redes sociales personalizados si existen
    await loadCustomSocialIcons();

    // Cargar URLs públicas de redes sociales alojadas en el servidor
    await loadSocialUrls();
    
    // 3. Inicializar Event Listeners
    initEventListeners();
    
    // 4. Renderizar Lista de Premios en el Sidebar
    renderAwardsChecklist();
    
    // 5. Pre-cargar recursos base
    await preloadBaseAssets();
    
    // 6. Primer dibujado e inicialización de código HTML
    draw();
    updateSignatureHtml();
});

// Generar los iconos de redes sociales dorados en un Canvas temporal y guardarlos en Base64 con alta resolución (128x128)
function generateSocialIconsBase64() {
    const networks = ['facebook', 'instagram', 'website'];
    const color = '#BEAF87';
    
    networks.forEach(net => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 128;
        tempCanvas.height = 128;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.strokeStyle = color;
        tempCtx.lineWidth = 7.2;
        tempCtx.beginPath();
        tempCtx.arc(64, 64, 52, 0, Math.PI * 2);
        tempCtx.stroke();
        
        tempCtx.fillStyle = color;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        
        if (net === 'facebook') {
            tempCtx.font = 'bold 68px "Barlow", Arial, sans-serif';
            tempCtx.fillText('f', 64, 62);
            
        } else if (net === 'instagram') {
            tempCtx.lineWidth = 6;
            tempCtx.strokeStyle = color;
            tempCtx.beginPath();
            tempCtx.roundRect ? tempCtx.roundRect(36, 36, 56, 56, 14) : tempCtx.rect(36, 36, 56, 56);
            tempCtx.stroke();
            
            tempCtx.beginPath();
            tempCtx.arc(64, 64, 14, 0, Math.PI * 2);
            tempCtx.stroke();
            
            tempCtx.fillStyle = color;
            tempCtx.beginPath();
            tempCtx.arc(78, 50, 4, 0, Math.PI * 2);
            tempCtx.fill();
            
        } else if (net === 'website') {
            tempCtx.lineWidth = 4.8;
            tempCtx.strokeStyle = color;
            tempCtx.beginPath();
            tempCtx.arc(64, 64, 30, 0, Math.PI * 2);
            tempCtx.stroke();
            
            tempCtx.beginPath();
            tempCtx.moveTo(34, 64);
            tempCtx.lineTo(94, 64);
            tempCtx.stroke();
            
            tempCtx.beginPath();
            tempCtx.moveTo(64, 34);
            tempCtx.lineTo(64, 94);
            tempCtx.stroke();
            
            tempCtx.beginPath();
            tempCtx.ellipse ? tempCtx.ellipse(64, 64, 14, 30, 0, 0, Math.PI * 2) : tempCtx.arc(64, 64, 14, 0, Math.PI * 2);
            tempCtx.stroke();
        }
        
        socialIconsBase64[net] = tempCanvas.toDataURL('image/png');
    });
}

// Cargar logos personalizados de redes sociales (si existen en assets/social/) con alta resolución (128x128)
async function loadCustomSocialIcons() {
    const networks = ['facebook', 'instagram', 'website'];

    const promises = networks.map(net => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 128;
                tempCanvas.height = 128;
                const tempCtx = tempCanvas.getContext('2d');
                
                const ratio = img.width / img.height;
                let w = 128;
                let h = 128;
                if (ratio > 1) {
                    h = 128 / ratio;
                } else {
                    w = 128 * ratio;
                }
                const x = (128 - w) / 2;
                const y = (128 - h) / 2;
                
                tempCtx.drawImage(img, x, y, w, h);
                socialIconsBase64[net] = tempCanvas.toDataURL('image/png');
                resolve(true);
            };
            img.onerror = () => {
                resolve(false);
            };
            img.src = `${customSocialPaths[net]}?v=${Date.now()}`;
        });
    });

    await Promise.all(promises);
}

// Cargar URLs públicas de redes sociales alojadas en el servidor
async function loadSocialUrls() {
    try {
        const response = await fetch('/social-urls');
        const data = await response.json();
        hostedSocialUrls.facebook = data.facebook || (window.location.origin + '/' + customSocialPaths.facebook);
        hostedSocialUrls.instagram = data.instagram || (window.location.origin + '/' + customSocialPaths.instagram);
        hostedSocialUrls.website = data.website || (window.location.origin + '/' + customSocialPaths.website);
        console.log("Hosted social URLs loaded successfully from server:", hostedSocialUrls);
    } catch (e) {
        console.error('Failed to load hosted social URLs, using local fallbacks:', e);
        hostedSocialUrls.facebook = window.location.origin + '/' + customSocialPaths.facebook;
        hostedSocialUrls.instagram = window.location.origin + '/' + customSocialPaths.instagram;
        hostedSocialUrls.website = window.location.origin + '/' + customSocialPaths.website;
    }
}

// Pre-cargar recursos en caché (fondos, logotipos oficiales recortados y premios)
async function preloadBaseAssets() {
    const assets = [
        'assets/backgrounds/bg_dark_with_photo.png',
        'assets/backgrounds/bg_dark_no_photo.png',
        'assets/backgrounds/bg_dark_with_photo_no_awards.png',
        'assets/backgrounds/bg_dark_no_photo_no_awards.png',
        'assets/backgrounds/bg_gold_with_photo.png',
        'assets/backgrounds/bg_gold_no_photo.png',
        'assets/backgrounds/bg_gold_with_photo_no_awards.png',
        'assets/backgrounds/bg_gold_no_photo_no_awards.png',
        'assets/backgrounds/bg_light_with_photo.png',
        'assets/backgrounds/bg_light_no_photo.png',
        'assets/backgrounds/bg_light_with_photo_no_awards.png',
        'assets/backgrounds/bg_light_no_photo_no_awards.png',
        // Logotipos Century 21 oficiales recortados
        'assets/logos/cropped_century_21_bravo_gold_logo_left_new_ver.png',
        'assets/logos/cropped_century_21_bravo_gold_logo_middle_new_ver.png',
        'assets/logos/cropped_century_21_bravo_logo_black_logo_left_new_ver.png',
        'assets/logos/cropped_century_21_bravo_logo_black_logo_middle_new_ver.png',
        'assets/logos/cropped_century_21_bravo_logo_gray_logo_middle_new_ver.png',
        'assets/logos/cropped_century_21_bravo_logo_white_logo_left_new_ver.png',
        // Premios oficiales del cliente
        'assets/awards/centurion_en.png',
        'assets/awards/doublecenturion_en.png',
        'assets/awards/grandcenturion_en.png',
        'assets/awards/c21_canada_centurion_honour_society.png',
        'assets/awards/centurion_10yr_en_1_.png',
        'assets/awards/centurion_21yr_en.png',
        'assets/awards/masters_ruby_en_g.png',
        'assets/awards/masters_emerald_en.png',
        'assets/awards/masters_diamond_en.png',
        'assets/awards/masters_silver_en.png',
        'assets/awards/pacesettergold_en.png',
        'assets/awards/pacesetterplatinum_en.png',
        'assets/awards/top30under30_logo_en_gold_1_.png',
        'assets/awards/top1percenten_1_.png',
        'assets/awards/longtermservicelogo_final_en_1_.png',
        'assets/awards/oa_en.png'
    ];
    
    const promises = assets.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                imageCache[src] = img;
                resolve();
            };
            img.onerror = () => {
                console.warn(`Error cargando recurso: ${src}`);
                resolve();
            };
            img.src = src;
        });
    });
    
    await Promise.all(promises);
}

// Cargar imagen de forma asíncrona
function loadImage(src) {
    if (imageCache[src]) {
        return Promise.resolve(imageCache[src]);
    }
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache[src] = img;
            resolve(img);
        };
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}

// Inicialización de Controladores de Eventos
function initEventListeners() {
    // Controladores de Temas
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.theme = e.target.value;
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            e.target.closest('.theme-option').classList.add('active');
            drawAndSync();
        });
    });

    // Controladores de Estilo (Con/Sin Foto)
    document.querySelectorAll('input[name="hasPhoto"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.hasPhoto = e.target.value === 'true';
            
            document.querySelectorAll('.toggle-option').forEach(opt => opt.classList.remove('active'));
            e.target.closest('.toggle-option').classList.add('active');
            
            const photoSec = document.getElementById('photoSection');
            if (state.hasPhoto) {
                photoSec.classList.remove('hidden');
            } else {
                photoSec.classList.add('hidden');
            }
            drawAndSync();
        });
    });

    // Carga de Foto de Agente
    const fileInput = document.getElementById('agentPhotoInput');
    const photoFileName = document.getElementById('photoFileName');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const adjustmentControls = document.getElementById('photoAdjustmentControls');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            state.photo.file = file;
            photoFileName.querySelector('.name-text').textContent = file.name;
            photoFileName.classList.remove('hidden');
            adjustmentControls.classList.remove('hidden');
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    state.photo.originalImgElement = img;
                    state.photo.imgElement = img;
                    drawAndSync();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    removePhotoBtn.addEventListener('click', () => {
        state.photo.file = null;
        state.photo.imgElement = null;
        fileInput.value = '';
        photoFileName.classList.add('hidden');
        adjustmentControls.classList.add('hidden');
        drawAndSync();
    });

    // Botones de Encuadre/Máscara de Foto
    document.querySelectorAll('.btn-group-mini button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-group-mini button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.photo.mask = e.target.dataset.mask;
            drawAndSync();
        });
    });

    // Sliders de Foto
    const sliderZoom = document.getElementById('sliderZoom');
    const sliderOffsetX = document.getElementById('sliderOffsetX');
    const sliderOffsetY = document.getElementById('sliderOffsetY');

    sliderZoom.addEventListener('input', (e) => {
        state.photo.zoom = parseFloat(e.target.value) / 100;
        document.getElementById('valZoom').textContent = `${e.target.value}%`;
        drawAndSync();
    });

    sliderOffsetX.addEventListener('input', (e) => {
        state.photo.offsetX = parseInt(e.target.value);
        document.getElementById('valOffsetX').textContent = `${e.target.value}px`;
        drawAndSync();
    });

    sliderOffsetY.addEventListener('input', (e) => {
        state.photo.offsetY = parseInt(e.target.value);
        document.getElementById('valOffsetY').textContent = `${e.target.value}px`;
        drawAndSync();
    });

    // Inputs de Texto de Datos Personales (Nombre y Cargo)
    const inputs = ['agentName', 'agentCargo', 'agentCargo2'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const stateKey = id.replace('agent', '').toLowerCase();
            input.addEventListener('input', (e) => {
                state.agent[stateKey] = e.target.value;
                drawAndSync();
            });
        }
    });

    // Entrada de Teléfono (solo números, máximo 10 dígitos)
    const phoneInput = document.getElementById('agentPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let clean = e.target.value.replace(/\D/g, '');
            if (clean.length > 10) {
                clean = clean.substring(0, 10);
            }
            e.target.value = clean;
            state.agent.phone = clean;
            drawAndSync();
        });
    }

    // Controlador de Premios Sí/No
    document.querySelectorAll('input[name="hasAwards"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.hasAwards = e.target.value === 'true';
            
            document.querySelectorAll('#toggleAwardsPossession .toggle-option').forEach(opt => opt.classList.remove('active'));
            e.target.closest('.toggle-option').classList.add('active');
            
            const container = document.getElementById('awardsSelectionContainer');
            if (state.hasAwards) {
                container.classList.remove('hidden');
                // Habilitar de nuevo los premios previamente seleccionados
                state.awards.forEach(a => {
                    if (a.id === 'masters_ruby' || a.id === 'pacesetter_gold') {
                        a.enabled = true;
                    }
                });
            } else {
                container.classList.add('hidden');
                // Deshabilitar todos los premios para el layout limpio
                state.awards.forEach(a => a.enabled = false);
            }
            renderAwardsChecklist();
            drawAndSync();
        });
    });

    // Inputs de Redes Sociales
    const socialInputs = ['socialFacebook', 'socialInstagram', 'socialWebsite'];
    socialInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const stateKey = id.replace('social', '').toLowerCase();
            input.addEventListener('input', (e) => {
                state.socials[stateKey] = e.target.value;
                drawAndSync();
            });
        }
    });

    // URL de Banner Hosted Opcional
    const hostedInput = document.getElementById('bannerHostedUrl');
    if (hostedInput) {
        hostedInput.addEventListener('input', (e) => {
            state.bannerHostedUrl = e.target.value;
            updateSignatureHtml();
        });
    }

    // Carga de Premio Personalizado
    const customAwardInput = document.getElementById('customAwardInput');
    customAwardInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const enabledCount = state.awards.filter(a => a.enabled).length;
            if (enabledCount >= 4) {
                alert('You can display a maximum of 4 awards. Please deselect one first.');
                customAwardInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const awardId = 'custom_' + Date.now();
                    const newAward = {
                        id: awardId,
                        name: file.name.split('.')[0],
                        file: event.target.result,
                        imgElement: img,
                        enabled: true,
                        isPreset: false
                    };
                    
                    state.awards.push(newAward);
                    renderAwardsChecklist();
                    customAwardInput.value = '';
                    drawAndSync();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Panel de Código HTML Toggle
    const btnToggleCode = document.getElementById('btnToggleCode');
    const codePanel = document.getElementById('codePanel');
    if (btnToggleCode && codePanel) {
        btnToggleCode.addEventListener('click', () => {
            codePanel.classList.toggle('hidden');
        });
    }

    // Botones de Copiar y Descargar
    document.getElementById('btnCopySignature').addEventListener('click', copySignatureToClipboard);
    const btnCopyRawHtml = document.getElementById('btnCopyRawHtml');
    if (btnCopyRawHtml) {
        btnCopyRawHtml.addEventListener('click', copyRawHtmlToClipboard);
    }
    document.getElementById('btnDownload').addEventListener('click', downloadBannerImage);
}

// Renderizar la checklist de premios en el sidebar (1 a 4)
function renderAwardsChecklist() {
    const container = document.getElementById('awardsChecklist');
    container.innerHTML = '';

    state.awards.forEach(award => {
        const item = document.createElement('label');
        item.className = `award-item ${award.enabled ? 'active' : ''}`;
        
        item.innerHTML = `
            <input type="checkbox" data-id="${award.id}" ${award.enabled ? 'checked' : ''}>
            <div class="checkbox-custom">
                <i class="fa-solid fa-check"></i>
            </div>
            <img class="award-thumb" src="${award.file}" alt="${award.name}">
            <div class="award-info">
                <span class="award-title">${award.name}</span>
                <span class="award-desc">${award.isPreset ? 'Official C21 Award' : 'User Uploaded'}</span>
            </div>
        `;

        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            const enabledCount = state.awards.filter(a => a.enabled).length;
            
            if (e.target.checked && enabledCount >= 4) {
                e.target.checked = false;
                alert('Maximum of 4 awards allowed.');
                return;
            }

            award.enabled = e.target.checked;
            item.classList.toggle('active', award.enabled);
            drawAndSync();
        });

        container.appendChild(item);
    });
}

// Sincronizar el HTML generado
function drawAndSync() {
    state.bannerHostedUrl = ''; // Limpiar la URL hospedada para forzar una nueva subida con los datos actualizados
    draw();
    updateSignatureHtml();
}

// Formatea un número de teléfono de 10 dígitos con el prefijo "C: "
function formatPhoneNumber(rawPhone) {
    const clean = (rawPhone || '').replace(/\D/g, '');
    if (clean.length === 0) return '';
    
    let formatted = 'C: ';
    if (clean.length <= 3) {
        formatted += clean;
    } else if (clean.length <= 6) {
        formatted += `${clean.substring(0, 3)}-${clean.substring(3)}`;
    } else {
        formatted += `${clean.substring(0, 3)}-${clean.substring(3, 6)}-${clean.substring(6, 10)}`;
    }
    return formatted;
}

// Función de Dibujado (Canvas Renderer)
async function renderCanvas(targetCanvas, scale = 1) {
    const width = 1024 * scale;
    const height = 265 * scale;
    targetCanvas.width = width;
    targetCanvas.height = height;
    
    const targetCtx = targetCanvas.getContext('2d');
    
    // Obtener premios activos
    const activeAwards = state.awards.filter(a => a.enabled);
    const awardsCount = activeAwards.length;
    
    // 1. Cargar fondo (si state.hasAwards es false, cargamos la versión sin línea)
    const suffix = (!state.hasAwards || awardsCount === 0) ? '_no_awards' : '';
    const bgKey = `bg_${state.theme}_${state.hasPhoto ? 'with_photo' : 'no_photo'}${suffix}.png`;
    const bgSrc = `assets/backgrounds/${bgKey}`;
    
    let bgImg = imageCache[bgSrc];
    if (!bgImg) {
        try {
            bgImg = await loadImage(bgSrc);
        } catch (e) {
            console.error('Error cargando fondo:', bgSrc, e);
        }
    }
    
    if (bgImg) {
        targetCtx.drawImage(bgImg, 0, 0, width, height);
    } else {
        targetCtx.fillStyle = state.theme === 'dark' ? '#252526' : (state.theme === 'gold' ? '#BEAF87' : '#FFFFFF');
        targetCtx.fillRect(0, 0, width, height);
    }

    // 2. Dibujar Foto del Agente (si aplica)
    if (state.hasPhoto && state.photo.imgElement) {
        targetCtx.save();
        
        const photoAreaW = 250 * scale;
        const photoAreaH = 265 * scale;
        const centerX = photoAreaW / 2;
        const centerY = photoAreaH / 2;

        if (state.photo.mask === 'circle') {
            const radius = 100 * scale;
            targetCtx.beginPath();
            targetCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            targetCtx.clip();
        } else if (state.photo.mask === 'rect') {
            const cardW = 200 * scale;
            const cardH = 215 * scale;
            const cardX = centerX - cardW / 2;
            const cardY = centerY - cardH / 2;
            const radius = 12 * scale;
            
            targetCtx.beginPath();
            targetCtx.moveTo(cardX + radius, cardY);
            targetCtx.lineTo(cardX + cardW - radius, cardY);
            targetCtx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
            targetCtx.lineTo(cardX + cardW, cardY + cardH - radius);
            targetCtx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
            targetCtx.lineTo(cardX + radius, cardY + cardH);
            targetCtx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
            targetCtx.lineTo(cardX, cardY + radius);
            targetCtx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
            targetCtx.closePath();
            targetCtx.clip();
        }

        const img = state.photo.imgElement;
        const photoTargetW = 250 * scale;
        const photoTargetH = 265 * scale;
        
        const imgRatio = img.width / img.height;
        const targetRatio = photoTargetW / photoTargetH;
        
        let drawW, drawH;
        if (imgRatio > targetRatio) {
            drawH = photoTargetH;
            drawW = photoTargetH * imgRatio;
        } else {
            drawW = photoTargetW;
            drawH = photoTargetW / imgRatio;
        }

        drawW *= state.photo.zoom;
        drawH *= state.photo.zoom;

        const drawX = centerX - drawW / 2 + (state.photo.offsetX * scale);
        const drawY = centerY - drawH / 2 + (state.photo.offsetY * scale);

        targetCtx.drawImage(img, drawX, drawY, drawW, drawH);
        targetCtx.restore();
    }

    // 3. Dibujar Bloque de Textos (Nombre, Cargo, Datos de Contacto)
    const startX = (state.hasPhoto ? 270 : 132) * scale;
    
    let colorName = '#FFFFFF';
    let colorCargo = '#BEAF87';
    let colorContact = '#BEAF87';
    let logoKey = '';

    if (state.theme === 'light') {
        colorName = '#252526';
        colorCargo = '#BEAF87';
        colorContact = '#BEAF87';
    } else if (state.theme === 'gold') {
        colorName = '#252526';
        colorCargo = '#FFFFFF';
        colorContact = '#FFFFFF';
    }

    targetCtx.save();
    
    // Configurar sombra premium para los textos solo en tema oscuro para legibilidad
    if (state.theme === 'dark') {
        targetCtx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        targetCtx.shadowBlur = 3 * scale;
        targetCtx.shadowOffsetX = 1.5 * scale;
        targetCtx.shadowOffsetY = 1.5 * scale;
    } else {
        targetCtx.shadowColor = 'transparent';
        targetCtx.shadowBlur = 0;
        targetCtx.shadowOffsetX = 0;
        targetCtx.shadowOffsetY = 0;
    }

    // A. Dibujar el Nombre
    targetCtx.fillStyle = colorName;
    targetCtx.textBaseline = 'alphabetic';
    
    const rawName = state.agent.name || '';
    let nameLines = [rawName];
    
    // Solo dividimos el nombre en dos líneas si posee premios (ya que el divisor vertical limita el espacio horizontal)
    const hasAwardsLayout = state.hasAwards && activeAwards.length > 0;
    
    if (hasAwardsLayout && rawName.length > 12 && rawName.includes(' ')) {
        const spaceIdx = rawName.indexOf(' ');
        nameLines = [
            rawName.substring(0, spaceIdx),
            rawName.substring(spaceIdx + 1)
        ];
    }

    let currentY = 56 * scale;
    const hasCargo2 = !!state.agent.cargo2;
    
    if (nameLines.length === 1) {
        if (hasAwardsLayout) {
            // Shift text upward to make room for the Century 21 logo at the bottom left
            const nameY = hasCargo2 ? (70 * scale) : (75 * scale);
            targetCtx.font = `800 ${44 * scale}px Barlow`;
            targetCtx.fillText(nameLines[0], startX, nameY);

            // B. Dibujar Cargo
            const cargo1Y = hasCargo2 ? (102 * scale) : (115 * scale);
            targetCtx.fillStyle = colorCargo;
            targetCtx.font = `700 ${17 * scale}px Barlow`;
            targetCtx.fillText((state.agent.cargo || '').toUpperCase(), startX, cargo1Y);

            if (hasCargo2) {
                const cargo2Y = 122 * scale;
                targetCtx.font = `500 ${13 * scale}px Barlow`;
                targetCtx.fillText(state.agent.cargo2.toUpperCase(), startX, cargo2Y);
            }

            // C. Dibujar Teléfono
            const phoneY = hasCargo2 ? (152 * scale) : (148 * scale);
            targetCtx.fillStyle = colorContact;
            targetCtx.font = `500 ${19 * scale}px Barlow`;
            targetCtx.fillText(formatPhoneNumber(state.agent.phone || ''), startX, phoneY);

            // D. Dibujar Dirección de Oficina
            const addressY = hasCargo2 ? (178 * scale) : (178 * scale);
            targetCtx.fillText(state.agent.address || '', startX, addressY);
        } else {
            // Standard layout when there are no awards (logo is on the right)
            const nameY = hasCargo2 ? (102 * scale) : (112 * scale);
            targetCtx.font = `800 ${54 * scale}px Barlow`;
            targetCtx.fillText(nameLines[0], startX, nameY);

            // B. Dibujar Cargo
            const cargo1Y = hasCargo2 ? (142 * scale) : (153 * scale);
            targetCtx.fillStyle = colorCargo;
            targetCtx.font = `700 ${19 * scale}px Barlow`;
            targetCtx.fillText((state.agent.cargo || '').toUpperCase(), startX, cargo1Y);

            if (hasCargo2) {
                const cargo2Y = 162 * scale;
                targetCtx.font = `500 ${13 * scale}px Barlow`;
                targetCtx.fillText(state.agent.cargo2.toUpperCase(), startX, cargo2Y);
            }

            // C. Dibujar Teléfono
            const phoneY = hasCargo2 ? (196 * scale) : (193 * scale);
            targetCtx.fillStyle = colorContact;
            targetCtx.font = `500 ${19 * scale}px Barlow`;
            targetCtx.fillText(formatPhoneNumber(state.agent.phone || ''), startX, phoneY);

            // D. Dibujar Dirección de Oficina
            const addressY = hasCargo2 ? (230 * scale) : (231 * scale);
            targetCtx.fillText(state.agent.address || '', startX, addressY);
        }
    } else {
        const name1Y = hasCargo2 ? (50 * scale) : (56 * scale);
        const name2Y = hasCargo2 ? (80 * scale) : (90 * scale);
        
        targetCtx.font = `800 ${32 * scale}px Barlow`;
        targetCtx.fillText(nameLines[0], startX, name1Y);
        targetCtx.fillText(nameLines[1], startX, name2Y);

        // B. Dibujar Cargo
        const cargo1Y = hasCargo2 ? (106 * scale) : (118 * scale);
        targetCtx.fillStyle = colorCargo;
        targetCtx.font = `700 ${17 * scale}px Barlow`;
        targetCtx.fillText((state.agent.cargo || '').toUpperCase(), startX, cargo1Y);

        if (hasCargo2) {
            const cargo2Y = 122 * scale;
            targetCtx.font = `500 ${13 * scale}px Barlow`;
            targetCtx.fillText(state.agent.cargo2.toUpperCase(), startX, cargo2Y);
        }

        // C. Dibujar Teléfono
        const phoneY = hasCargo2 ? (146 * scale) : (139 * scale);
        targetCtx.fillStyle = colorContact;
        targetCtx.font = `500 ${19 * scale}px Barlow`;
        targetCtx.fillText(formatPhoneNumber(state.agent.phone || ''), startX, phoneY);

        // D. Dibujar Dirección de Oficina
        const addressY = hasCargo2 ? (166 * scale) : (159 * scale);
        targetCtx.fillText(state.agent.address || '', startX, addressY);
    }

    targetCtx.restore(); // Restauramos el contexto para quitar la sombra del texto antes de dibujar el logo

    // E. Dibujar Logotipo Oficial Cropped (con nombre de oficina "Bravo Realty" ya integrado)
    // El logotipo oficial que usamos depende del tema (Oscuro, Claro, Dorado) y de si posee premios
    if (state.hasAwards && awardsCount > 0) {
        if (state.theme === 'dark') {
            logoKey = 'cropped_century_21_bravo_logo_white_logo_left_new_ver.png';
        } else {
            logoKey = 'cropped_century_21_bravo_logo_black_logo_left_new_ver.png';
        }
    } else {
        if (state.theme === 'dark') {
            logoKey = 'cropped_century_21_bravo_gold_logo_middle_new_ver.png';
        } else {
            logoKey = 'cropped_century_21_bravo_logo_black_logo_middle_new_ver.png';
        }
    }

    const isNoAwardsLayout = !state.hasAwards || awardsCount === 0;
    const logoX = isNoAwardsLayout ? 766 * scale : startX;
    // Si no tiene premios, el logo se alinea al nivel de la última línea de texto (address a y = 231),
    // terminando exactamente allí. Si tiene premios, se dibuja debajo (a y = 195).
    const logoY = isNoAwardsLayout ? 186 * scale : 195 * scale;
    const logoW = 194 * scale;
    const logoH = 45 * scale;

    const logoSrc = `assets/logos/${logoKey}`;
    let logoImg = imageCache[logoSrc];
    if (!logoImg) {
        try {
            logoImg = await loadImage(logoSrc);
        } catch (e) {
            console.error('Error cargando logo oficial:', logoSrc, e);
        }
    }

    if (logoImg) {
        targetCtx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    } else {
        // Fallback si la imagen no carga por alguna razón
        targetCtx.fillStyle = state.theme === 'dark' ? '#FFFFFF' : '#252526';
        targetCtx.font = `800 ${18 * scale}px Barlow`;
        targetCtx.fillText('CENTURY 21.', logoX, logoY + 18 * scale);
        targetCtx.font = `600 ${13.5 * scale}px Barlow`;
        targetCtx.fillText(state.agent.office || '', logoX, logoY + 38 * scale);
    }

    // 4. Dibujar Premios (Sección Derecha)
    if (state.hasAwards && awardsCount >= 1) {
        const dividerX = (state.hasPhoto ? 600 : 461) * scale;
        const rightAreaW = (1024 * scale) - dividerX;
        const layoutNoPhoto = !state.hasPhoto;

        if (awardsCount === 1) {
            const centerX = dividerX + (rightAreaW / 2);
            const centerY = 132.5 * scale;
            await drawAwardCentered(targetCtx, activeAwards[0], centerX, centerY, 210 * scale, 220 * scale);
            
        } else if (awardsCount === 2) {
            if (state.hasPhoto) {
                // Si tiene foto, el espacio es estrecho, se apilan verticalmente
                const centerX = dividerX + (rightAreaW / 2);
                const row1Y = 72 * scale;
                const row2Y = 193 * scale;
                await drawAwardCentered(targetCtx, activeAwards[0], centerX, row1Y, 135 * scale, 120 * scale);
                await drawAwardCentered(targetCtx, activeAwards[1], centerX, row2Y, 135 * scale, 120 * scale);
            } else {
                // Si no tiene foto, hay espacio horizontal, van lado a lado
                const col1Center = dividerX + (rightAreaW / 4);
                const col2Center = dividerX + (3 * rightAreaW / 4);
                const centerY = 132.5 * scale;
                await drawAwardCentered(targetCtx, activeAwards[0], col1Center, centerY, 190 * scale, 210 * scale);
                await drawAwardCentered(targetCtx, activeAwards[1], col2Center, centerY, 190 * scale, 210 * scale);
            }
            
        } else if (awardsCount === 3 && layoutNoPhoto) {
            const col1Center = dividerX + (rightAreaW / 6);
            const col2Center = dividerX + (3 * rightAreaW / 6);
            const col3Center = dividerX + (5 * rightAreaW / 6);
            const centerY = 132.5 * scale;
            await drawAwardCentered(targetCtx, activeAwards[0], col1Center, centerY, 160 * scale, 180 * scale);
            await drawAwardCentered(targetCtx, activeAwards[1], col2Center, centerY, 160 * scale, 180 * scale);
            await drawAwardCentered(targetCtx, activeAwards[2], col3Center, centerY, 160 * scale, 180 * scale);

        } else if (awardsCount === 3 && !layoutNoPhoto) {
            const col1Center = dividerX + (rightAreaW / 4);
            const col2Center = dividerX + (3 * rightAreaW / 4);
            const col3Center = dividerX + (rightAreaW / 2);
            const row1Y = 72 * scale;
            const row2Y = 193 * scale;
            await drawAwardCentered(targetCtx, activeAwards[0], col1Center, row1Y, 135 * scale, 120 * scale);
            await drawAwardCentered(targetCtx, activeAwards[1], col2Center, row1Y, 135 * scale, 120 * scale);
            await drawAwardCentered(targetCtx, activeAwards[2], col3Center, row2Y, 135 * scale, 120 * scale);

        } else if (awardsCount === 4) {
            const col1Center = dividerX + (rightAreaW / 4);
            const col2Center = dividerX + (3 * rightAreaW / 4);
            const row1Y = 72 * scale;
            const row2Y = 193 * scale;
            await drawAwardCentered(targetCtx, activeAwards[0], col1Center, row1Y, 135 * scale, 120 * scale);
            await drawAwardCentered(targetCtx, activeAwards[1], col2Center, row1Y, 135 * scale, 120 * scale);
            await drawAwardCentered(targetCtx, activeAwards[2], col1Center, row2Y, 135 * scale, 120 * scale);
            await drawAwardCentered(targetCtx, activeAwards[3], col2Center, row2Y, 135 * scale, 120 * scale);
        }
    }
}

// Cargar de forma asíncrona un premio con fallback al tema específico si existe en assets/awards/[theme]/
function loadThemeSpecificAward(award, theme) {
    if (!award.isPreset) {
        return Promise.resolve(award.imgElement);
    }
    
    // Obtener solo el nombre del archivo (ej. 'centurion_en.png')
    const filename = award.file.split('/').pop();
    const themeSrc = `assets/awards/${theme}/${filename}`;
    const fallbackSrc = `assets/awards/${filename}`;
    
    if (!award.cachedImages) {
        award.cachedImages = {};
    }
    
    if (award.cachedImages[theme]) {
        return Promise.resolve(award.cachedImages[theme]);
    }
    
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            award.cachedImages[theme] = img;
            resolve(img);
        };
        img.onerror = () => {
            // Fallback al archivo original en la raíz de assets/awards/
            loadImage(fallbackSrc).then(fallbackImg => {
                award.cachedImages[theme] = fallbackImg;
                resolve(fallbackImg);
            }).catch(err => {
                console.error(`Error cargando fallback para premio ${award.name}:`, err);
                resolve(null);
            });
        };
        img.src = `${themeSrc}?v=${Date.now()}`;
    });
}

// Dibujar un premio centrado en una coordenada
async function drawAwardCentered(targetCtx, award, centerX, centerY, maxW, maxH) {
    let img = null;
    try {
        img = await loadThemeSpecificAward(award, state.theme);
    } catch (e) {
        console.error('Error cargando premio temático:', award.name, e);
    }
    
    if (!img) {
        img = award.imgElement;
    }
    if (!img) {
        if (imageCache[award.file]) {
            img = imageCache[award.file];
        } else {
            try {
                img = await loadImage(award.file);
            } catch (e) {
                console.error('Error cargando premio fallback final:', award.name, e);
                return;
            }
        }
    }

    if (img) {
        const imgRatio = img.width / img.height;
        const targetRatio = maxW / maxH;
        
        let drawW, drawH;
        if (imgRatio > targetRatio) {
            drawW = maxW;
            drawH = maxW / imgRatio;
        } else {
            drawH = maxH;
            drawW = maxH * imgRatio;
        }

        const drawX = centerX - drawW / 2;
        const drawY = centerY - drawH / 2;
        targetCtx.drawImage(img, drawX, drawY, drawW, drawH);
    }
}

// Dibujado del preview
function draw() {
    renderCanvas(canvas, 1);
}

// Genera el código HTML enriquecido de la firma
function generateSignatureHtml() {
    let bannerSrc = state.bannerHostedUrl;
    if (!bannerSrc) {
        bannerSrc = canvas.toDataURL('image/png');
    }
    
    const name = state.agent.name || 'Agente';
    
    let html = `<table cellpadding="0" cellspacing="0" style="font-family: 'Barlow', Arial, sans-serif; border-collapse: collapse; text-align: left; width: 1024px; max-width: 100%;">\n`;
    
    const activeSocials = Object.entries(state.socials).filter(([net, url]) => url.trim() !== '');
    
    if (activeSocials.length > 0) {
        html += `  <tr>\n`;
        html += `    <td style="padding: 0 0 10px 0; margin: 0; border: 0; text-align: right;">\n`;
        html += `      <table cellpadding="0" cellspacing="0" style="display: inline-block; border-collapse: collapse;">\n`;
        html += `        <tr>\n`;
        
        activeSocials.forEach(([net, url]) => {
            let finalUrl = url.trim();
            if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
                finalUrl = 'https://' + finalUrl;
            }
            const iconUrl = hostedSocialUrls[net] || new URL(customSocialPaths[net], window.location.href).href;
            
            html += `          <td style="padding-left: 10px; border: 0; vertical-align: middle;">\n`;
            html += `            <a href="${finalUrl}" target="_blank" style="text-decoration: none; display: block; border: 0;">\n`;
            html += `              <img src="${iconUrl}" width="32" height="32" style="display: block; width: 32px; height: 32px; border: 0;" alt="${net}"/>\n`;
            html += `            </a>\n`;
            html += `          </td>\n`;
        });
        
        html += `        </tr>\n`;
        html += `      </table>\n`;
        html += `    </td>\n`;
        html += `  </tr>\n`;
    }
    
    html += `  <tr>\n`;
    html += `    <td style="padding: 0; margin: 0; border: 0; line-height: 0;">\n`;
    html += `      <img src="${bannerSrc}" width="1024" height="265" style="display: block; width: 1024px; height: auto; max-width: 100%; border: 0;" alt="${name} - Century 21"/>\n`;
    html += `    </td>\n`;
    html += `  </tr>\n`;
    
    html += `</table>`;
    return html;
}

// Sincronizar el HTML generado en el preview y textarea
function updateSignatureHtml() {
    const activeSocials = Object.entries(state.socials).filter(([net, url]) => url.trim() !== '');
    const previewContainer = document.getElementById('socialIconsPreview');
    previewContainer.innerHTML = '';
    
    if (activeSocials.length > 0) {
        activeSocials.forEach(([net, url]) => {
            let finalUrl = url.trim();
            if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
                finalUrl = 'https://' + finalUrl;
            }
            const link = document.createElement('a');
            link.href = finalUrl;
            link.target = '_blank';
            link.style.textDecoration = 'none';
            
            const img = document.createElement('img');
            img.src = socialIconsBase64[net];
            img.className = 'social-preview-icon';
            img.alt = net;
            
            link.appendChild(img);
            previewContainer.appendChild(link);
        });
    }
    
    const htmlCode = generateSignatureHtml();
    const rawHtmlTextarea = document.getElementById('rawHtmlCode');
    if (rawHtmlTextarea) {
        rawHtmlTextarea.value = htmlCode;
    }
}

async function uploadToImgur(base64Image) {
    const cleanBase64 = base64Image.replace(/^data:image\/png;base64,/, "");
    const params = new URLSearchParams();
    params.append('image', cleanBase64);
    
    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID 546c25a59c58ad7',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        const data = await response.json();
        if (data.success) {
            return data.data.link;
        } else {
            console.error("Imgur upload error response:", data);
        }
    } catch (e) {
        console.error("Imgur upload failed:", e);
    }
    return null;
}

// Obtiene la URL hospedada del banner (subida automática en segundo plano)
async function getHostedBannerUrl() {
    if (state.bannerHostedUrl) {
        return state.bannerHostedUrl;
    }
    
    const base64Image = canvas.toDataURL('image/png');
    
    // Si estamos en un host estático como GitHub Pages, subimos directo a Imgur desde el cliente
    const isStaticHost = window.location.hostname.endsWith('.github.io') || window.location.hostname.endsWith('.github.io.');
    
    if (isStaticHost) {
        console.log("Static host (GitHub Pages) detected. Uploading banner directly to Imgur...");
        const imgurUrl = await uploadToImgur(base64Image);
        if (imgurUrl) {
            return imgurUrl;
        }
    } else {
        console.log("Uploading banner to server (which proxies to Imgur)...");
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: base64Image })
            });
            const data = await response.json();
            if (data.success) {
                if (data.url.startsWith('http')) {
                    return data.url;
                } else {
                    return window.location.origin + data.url;
                }
            }
        } catch (e) {
            console.warn("Server upload failed, trying direct Imgur fallback...", e);
        }
        
        // Carga de respaldo en el navegador del cliente si el backend está caído
        console.log("Trying direct client-side Imgur upload fallback...");
        const imgurUrl = await uploadToImgur(base64Image);
        if (imgurUrl) {
            return imgurUrl;
        }
    }
    
    // Si todo falla, retornamos el base64 original
    return base64Image;
}

// Copiar firma rica al portapapeles
async function copySignatureToClipboard() {
    const btn = document.getElementById('btnCopySignature');
    const originalHTML = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Hosting Banner...';

    // 1. Obtener la URL hospedada automáticamente
    const hostedUrl = await getHostedBannerUrl();
    
    // Si no se pudo hospedar (error o fallback a base64), mostramos un error limpio y detenemos la copia
    if (!hostedUrl || !hostedUrl.startsWith('http')) {
        const isStaticHost = window.location.hostname.endsWith('.github.io') || window.location.hostname.endsWith('.github.io.');
        let errorMsg = "⚠️ Error: No se pudo hospedar la imagen del banner en internet.\n\n" +
                       "Gmail tiene un límite de caracteres estricto y no admite firmas con imágenes incrustadas muy largas.\n\n";
        
        if (isStaticHost) {
            errorMsg += "💡 DETECTADO GITHUB PAGES:\n" +
                        "Los bloqueadores de anuncios (AdBlock, uBlock, Brave Shield, etc.) suelen bloquear la subida de imágenes a Imgur.\n\n" +
                        "Por favor, desactiva tu bloqueador de anuncios (AdBlocker) para esta página, recárgala y vuelve a intentarlo.";
        } else {
            errorMsg += "Verifica tu conexión a internet, asegúrate de que el servidor está corriendo y recarga la página antes de intentar de nuevo.";
        }
        alert(errorMsg);
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        return;
    }
    
    // Si se hospedó correctamente, actualizamos el estado y el input para el renderizado HTML
    state.bannerHostedUrl = hostedUrl;
    const hostedInput = document.getElementById('bannerHostedUrl');
    if (hostedInput) {
        hostedInput.value = hostedUrl;
    }
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Copying...';

    const htmlString = generateSignatureHtml();
    // Actualizar el textarea con el código HTML optimizado
    const rawHtmlTextarea = document.getElementById('rawHtmlCode');
    if (rawHtmlTextarea) {
        rawHtmlTextarea.value = htmlString;
    }
    
    try {
        if (navigator.clipboard && window.ClipboardItem) {
            const blob = new Blob([htmlString], { type: 'text/html' });
            const clipboardItem = new ClipboardItem({
                'text/html': blob,
                'text/plain': new Blob([htmlString], { type: 'text/plain' })
            });
            await navigator.clipboard.write([clipboardItem]);
            alert('🚀 Signature copied successfully!\n\nNow go to your email signature settings and press Ctrl+V (Paste).');
        } else {
            throw new Error('ClipboardItem not supported');
        }
    } catch (e) {
        console.error('Error using enriched Clipboard API, trying fallback:', e);
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.innerHTML = htmlString;
        document.body.appendChild(tempDiv);
        
        const range = document.createRange();
        range.selectNode(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        try {
            document.execCommand('copy');
            alert('🚀 Signature copied (compatibility mode)!\n\nGo to your email settings and press Ctrl+V to paste.');
        } catch (err) {
            alert('Your browser does not allow automatic copying. Please copy the source code in the panel below.');
        } finally {
            selection.removeAllRanges();
            document.body.removeChild(tempDiv);
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

// Copiar el código HTML plano
function copyRawHtmlToClipboard() {
    const textarea = document.getElementById('rawHtmlCode');
    textarea.select();
    try {
        document.execCommand('copy');
        alert('📋 HTML code copied to clipboard!');
    } catch (e) {
        alert('Could not copy. Please select the code manually.');
    }
}

// Descargar el Banner en Alta Resolución (2x)
async function downloadBannerImage() {
    const btn = document.getElementById('btnDownload');
    const originalHTML = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating HD...';

    try {
        const exportCanvas = document.createElement('canvas');
        await renderCanvas(exportCanvas, 2);
        
        const dataUrl = exportCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        const cleanName = (state.agent.name || 'signature').toLowerCase().replace(/\s+/g, '_');
        link.download = `email_banner_${cleanName}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (e) {
        console.error(e);
        alert('Error downloading image.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}
