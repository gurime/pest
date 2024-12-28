const postInput = document.getElementById('post-input');
const moodOptions = document.querySelectorAll('.mood-option');
const postButton = document.getElementById('post-button');
const postsContainer = document.getElementById('posts-container');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');

let selectedMood = null;
let selectedImage = null;

// Mood Selection
moodOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove previous selection
        moodOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selection to clicked option
        option.classList.add('selected');
        selectedMood = option.dataset.mood;
    });
});

// Image Upload
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            selectedImage = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Post Creation
postButton.addEventListener('click', () => {
    const postText = postInput.value.trim();
    
    // Validate post
    if (!postText && !selectedImage) {
        alert('Please enter a post or upload an image');
        return;
    }

    // Create post object
    const post = {
        id: Date.now(),
        text: postText,
        mood: selectedMood || 'no-mood',
        image: selectedImage,
        timestamp: new Date().toLocaleString()
    };

    // Save to local storage
    const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    posts.unshift(post);
    localStorage.setItem('socialPosts', JSON.stringify(posts));

    // Render post
    renderPosts();

    // Reset form
    postInput.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    selectedImage = null;
    selectedMood = null;
    moodOptions.forEach(opt => opt.classList.remove('selected'));
});

// Render Posts
function renderPosts() {
    const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        // Mood tag
        const moodTag = document.createElement('div');
        moodTag.textContent = `Mood: ${post.mood.replace('-', ' ')}`;
        moodTag.style.marginBottom = '10px';
        moodTag.style.fontWeight = 'bold';
        moodTag.style.color = getMoodColor(post.mood);

        // Post text
        const textElement = document.createElement('p');
        textElement.textContent = post.text;

        // Image (if exists)
        let imageElement;
        if (post.image) {
            imageElement = document.createElement('img');
            imageElement.src = post.image;
            imageElement.style.Width = '100%';
            imageElement.style.borderRadius = '4px';
            imageElement.style.height = '20rem'
        }

        // Timestamp
        const timestampElement = document.createElement('small');
        timestampElement.textContent = post.timestamp;
        timestampElement.style.color = '#888';
        timestampElement.style.display = 'block';
        timestampElement.style.marginTop = '10px';

        // Append elements
        postElement.appendChild(moodTag);
        if (post.text) postElement.appendChild(textElement);
        if (imageElement) postElement.appendChild(imageElement);
        postElement.appendChild(timestampElement);

        postsContainer.appendChild(postElement);
    });
}

// Helper to get mood color
function getMoodColor(mood) {
    const colorMap = {
        'Positively-Positive': '#2e7d32',
        'Positively-Negative': '#f57c00',
        'Negatively-Positive': '#c62828',
        'Negatively-Negative': '#6a1b9a'
    };
    return colorMap[mood] || '#a522c9' || '#000';
}

// Initial render of posts
renderPosts();