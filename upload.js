const createElement = (tag, classnames = [], content) => {
    const node = document.createElement(tag);

    if (classnames.length) {
        node.classList.add(...classnames);
    }

    if (content) {
        node.textContent = content;
    }

    return node;
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
      return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
  }

export function uploadInit(selector, options = {}) {
    let files = [];

    const fileInput = document.querySelector(selector);
    const openBtn = createElement('button', ['btn'], 'Открыть');
    const previewContainer = createElement('div', ['preview']);
    const upload = createElement('button', ['btn', 'primary'], 'Загрузить');

    fileInput.style.display = 'none';
    upload.style.display = 'none';

    if (options.multy) {
        fileInput.setAttribute('multiple', true);
    }

    fileInput.insertAdjacentElement('afterend', previewContainer);
    fileInput.insertAdjacentElement('afterend', upload)
    fileInput.insertAdjacentElement('afterend', openBtn)

    const handleOpenClick = () => fileInput.click();

    const handleChange = (event) => {
      if (!event.target.files.length) {
        return;
      }

      previewContainer.innerHTML = '';

      files = Array.from(event.target.files);

      upload.style.display = 'inline'
    
      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const src = event.target.result;
            
            previewContainer.insertAdjacentHTML('afterbegin', `
                <div class="preview-image">
                   <div class="preview-remove" data-name="${file.name}">&times;</div>
                   <img src="${src}" alt="${file.name}"/>
                   <div class="preview-info">
                        <span>${file.name}</span>
                        <span>${bytesToSize(file.sizes)}</span>
                   </div>
                </div>
            `);
        };

        reader.readAsDataURL(file);
      });
    };

    const handleRemove = (event) => {
        if (!event.target.dataset.name) {
            return;
        }

        const { name } = event.target.dataset;

        files = files.filter((file) =>  file.name !== name);

        if (!files.length) {
            upload.style.display = 'none'
          }

        const block = previewContainer
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image');

        block.classList.add('removing');
        setTimeout(() => block.remove(), 300);
    }

    openBtn.addEventListener('click', handleOpenClick);
    fileInput.addEventListener('change', handleChange);
    previewContainer.addEventListener('click', handleRemove);

}