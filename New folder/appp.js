const storyUrl = document.getElementById('storyUrl');
const downloadBtn = document.getElementById('downloadBtn');
const downloadContainer = document.getElementById('downloadContainer');

async function fetchInstagramStory(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        // Parse the HTML to extract the story URLs
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const storyUrls = Array.from(doc.querySelectorAll('video[src]'))
            .map(video => video.getAttribute('src'))
            .concat(Array.from(doc.querySelectorAll('img[src^="https://scontent"]'))
                .map(img => img.getAttribute('src')));

        return storyUrls;
    } catch (error) {
        console.error('Error fetching Instagram story:', error);
        return [];
    }
}

downloadBtn.addEventListener('click', async () => {
    const url = storyUrl.value.trim();
    if (url) {
        const storyUrls = await fetchInstagramStory(url);

        if (storyUrls.length > 0) {
            // Create download links for each story
            storyUrls.forEach(url => {
                const link = document.createElement('a');
                link.href = url;
                link.download = url.split('/').pop();
                link.textContent = `Download ${link.download}`;
                downloadContainer.appendChild(link);
                downloadContainer.appendChild(document.createElement('br'));
            });
        } else {
            alert('No stories found at the provided URL.');
        }
    } else {
        alert('Please enter a valid Instagram Story URL.');
    }
});