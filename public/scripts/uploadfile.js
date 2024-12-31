document.addEventListener('DOMContentLoaded', () => {
    const dropzoneInput = document.getElementById('dropzone-file');
    const dropzoneLabel = document.querySelector('.dropzone');
    const uploadForm = document.getElementById('uploadForm');
    const fileList = document.getElementById('fileList');

    fetch('/main/files')
        .then((response) => response.json())
        .then((data) => {
            if (data.files && data.files.length > 0) {
                data.files.forEach((file) => {
                    addFileToList(file.url);
                });
            } else {
                console.log('No files found for this user.');
            }
        })
        .catch((error) => {
            console.error('Error fetching files:', error);
        });

    dropzoneLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzoneLabel.classList.add('dropzone-hover');
    });

    dropzoneLabel.addEventListener('dragleave', () => {
        dropzoneLabel.classList.remove('dropzone-hover');
    });

    dropzoneLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzoneLabel.classList.remove('dropzone-hover');
        const files = e.dataTransfer.files;
        if (files.length) {
            dropzoneInput.files = files;
            console.log('Files dropped:', files);
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!dropzoneInput.files.length) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', dropzoneInput.files[0]);

        try {
            const response = await fetch('/main/uploaddocs', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 401) {
                alert('Unauthorized! Please log in.');
                window.location.href = '/user/login';
                return;
            }

            const data = await response.json();

            if (response.ok) {
                alert('File uploaded successfully');
                addFileToList(data.data.uploads[data.data.uploads.length - 1].url);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        }
    });

    function addFileToList(url) {
        if (!fileList) {
            console.error('fileList element not found!');
            return;
        }
    
        const card = document.createElement('div');
        card.className = 'card';
    
        const link = document.createElement('a');
        link.href = url; 
        link.target = '_blank'; 
    
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Uploaded File';
    
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        cardBody.textContent = 'Uploaded Image';
    
        link.appendChild(img);
        card.appendChild(link);
        card.appendChild(cardBody);
    
        fileList.appendChild(card);
    }
    
});
