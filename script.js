document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateIcon('dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        updateIcon('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        
        themeIcon.animate([
            { transform: 'rotate(0)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // Reading Progress Bar
    const progressBar = document.getElementById('progress-bar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 3D tilt effect logic
    function initTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt-effect:not(.tilt-initialized)');
        tiltElements.forEach(el => {
            el.classList.add('tilt-initialized');
            
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xRotation = ((y - rect.height / 2) / rect.height) * 10;
                const yRotation = ((x - rect.width / 2) / rect.width) * -10;
                
                el.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // Magazine Explorer Logic (Real Wikipedia API)
    const searchInput = document.getElementById('topic-search');
    const searchBtn = document.getElementById('search-btn');
    const pills = document.querySelectorAll('.pill');
    const resultsGrid = document.getElementById('magazine-results');

    async function fetchMagazines(topic) {
        if (!resultsGrid) return;
        
        resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.6rem;">Searching global databases...</p>';
        
        try {
            const searchQuery = topic.trim() || 'trending news';
            // Use Wikipedia API to search for real articles and their revisions
            const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=8&prop=pageimages|extracts|revisions&rvprop=timestamp|user&piprop=thumbnail&pithumbsize=400&exchars=150&exintro=1`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            resultsGrid.innerHTML = '';

            if (!data.query || !data.query.pages) {
                resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.6rem;">No articles found. Try another topic.</p>';
                return;
            }

            const pages = Object.values(data.query.pages);

            pages.forEach((page, index) => {
                const title = page.title;
                const snippet = page.extract ? page.extract.replace(/(<([^>]+)>)/gi, "") : `Discover more about ${title} and related topics in this issue.`;
                
                // Metadata
                let author = "Wikipedia Contributors";
                let dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                if (page.revisions && page.revisions.length > 0) {
                    author = page.revisions[0].user;
                    dateStr = new Date(page.revisions[0].timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                }

                // Use wikipedia thumbnail if available, else fallback to a generated placeholder
                const imgSrc = page.thumbnail ? page.thumbnail.source : `https://loremflickr.com/400/300/${encodeURIComponent(searchQuery)}?lock=${page.pageid || index}`;
                const heroImgSrc = page.thumbnail ? page.thumbnail.source.replace(/\/\d+px-/, '/800px-') : imgSrc;

                const card = document.createElement('article');
                card.className = 'magazine-card tilt-effect';
                
                card.innerHTML = `
                    <img src="${imgSrc}" alt="${title}" class="magazine-img" loading="lazy" />
                    <div class="magazine-content" style="display: flex; flex-direction: column; flex-grow: 1;">
                        <span class="magazine-tag">${searchQuery.toUpperCase()}</span>
                        <h4 class="magazine-title">${title}</h4>
                        <p class="magazine-desc" style="flex-grow: 1;">${snippet}</p>
                        <div class="magazine-meta" style="margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-secondary); display: flex; justify-content: space-between; border-top: 1px solid var(--glass-border); padding-top: 1rem;">
                            <span class="meta-author" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60%;"><i class="fas fa-user" style="margin-right: 5px;"></i>${author}</span>
                            <span class="meta-date" style="white-space: nowrap;"><i class="far fa-calendar-alt" style="margin-right: 5px;"></i>${dateStr}</span>
                        </div>
                        <button style="width: 100%; background: var(--accent-color); color: white; border: none; padding: 1.2rem; border-radius: 8px; font-weight: bold; font-size: 1.4rem; cursor: pointer; transition: opacity 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">Read Full Magazine <i class="fas fa-arrow-right" style="margin-left: 5px;"></i></button>
                    </div>
                `;
                
                // Add click listener for modal
                card.addEventListener('click', () => openArticle(page.pageid, title, heroImgSrc, searchQuery));
                
                resultsGrid.appendChild(card);
            });

            initTiltEffect();

        } catch (error) {
            resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.6rem;">Error fetching articles. Please try again later.</p>';
            console.error('API Error:', error);
        }
    }

    if (searchBtn && searchInput) {
        function handleSearch() {
            const query = searchInput.value;
            if (query) {
                pills.forEach(p => p.classList.remove('active'));
                fetchMagazines(query);
            }
        }

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                searchInput.value = '';
                fetchMagazines(pill.dataset.category);
            });
        });

        // Initial load
        fetchMagazines('innovation');
    }

    // --- Article View Logic ---
    const exploreView = document.getElementById('explore-view');
    const articleView = document.getElementById('article-view');
    const closeArticleBtn = document.getElementById('close-article-btn');

    async function openArticle(pageId, title, heroImgSrc, tag) {
        if (!exploreView || !articleView) return;
        
        // Hide explore, show article
        exploreView.classList.add('hidden');
        articleView.classList.remove('hidden');
        window.scrollTo(0, 0);

        // Populate header
        // Use LoremFlickr for a guaranteed high-res hero image instead of potentially broken Wikipedia thumbnails
        document.getElementById('article-hero-img').src = `https://loremflickr.com/1920/1080/${encodeURIComponent(tag)}?lock=${pageId}`;
        document.getElementById('article-tag').textContent = tag.toUpperCase();
        document.getElementById('article-title').textContent = title;
        document.getElementById('article-subtitle').textContent = `An in-depth exploration of ${title}.`;
        
        const pageUrl = `https://en.wikipedia.org/?curid=${pageId}`;
        document.getElementById('article-source').href = pageUrl;
        
        // Social links
        document.getElementById('btn-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
        document.getElementById('btn-twitter').href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent('Read: ' + title)}`;
        document.getElementById('btn-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
        
        // Populate Gallery Images
        document.getElementById('gallery-img-1').src = `https://loremflickr.com/600/400/${encodeURIComponent(tag)}?lock=${pageId + 1}`;
        document.getElementById('gallery-img-2').src = `https://loremflickr.com/600/400/${encodeURIComponent(tag)}?lock=${pageId + 2}`;

        // Loading state for body
        const articleBody = document.getElementById('article-body');
        const articleToc = document.getElementById('article-toc');
        const articleQuote = document.getElementById('article-quote');
        const articleSource = document.getElementById('article-source');
        const articleDate = document.getElementById('article-date');
        
        articleBody.innerHTML = '<p style="text-align:center; padding: 5rem; font-size: 1.8rem;">Loading full article...</p>';
        articleToc.innerHTML = '';
        articleQuote.textContent = `"Exploring the nuances of ${title}..."`;
        articleSource.textContent = "Loading Author...";
        articleDate.textContent = "Loading Date...";

        try {
            // Fetch the full article extract and revision info from Wikipedia
            const articleUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|revisions&rvprop=timestamp|user&pageids=${pageId}&explaintext=1&exsectionformat=plain`;
            const response = await fetch(articleUrl);
            const data = await response.json();
            
            const pageData = data.query.pages[pageId];
            const extract = pageData.extract || `No content available for ${title}.`;
            
            if (pageData.revisions && pageData.revisions.length > 0) {
                const rev = pageData.revisions[0];
                articleSource.textContent = rev.user;
                const dateObj = new Date(rev.timestamp);
                articleDate.textContent = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            } else {
                articleSource.textContent = "Wikipedia Contributors";
                articleDate.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }

            // Process text: split into paragraphs
            const paragraphs = extract.split('\n\n').filter(p => p.trim().length > 20);
            
            if (paragraphs.length === 0) {
                articleBody.innerHTML = '<p>This article exists but does not have a text extract available.</p>';
                return;
            }

            // Generate HTML
            let html = '';
            let tocHtml = '';
            let tocCount = 1;

            paragraphs.forEach((p, i) => {
                // Check if it looks like a heading
                if (p.length < 80 && !p.endsWith('.') && !p.includes(',') && i > 0) {
                    html += `<h3>${p.replace(/=/g, '').trim()}</h3>`;
                    
                    if (tocCount <= 4) {
                        tocHtml += `
                            <li class="timeline-item">
                                <div class="timeline-marker"></div>
                                <h4 class="timeline-title">Section ${tocCount}</h4>
                                <p>${p.replace(/=/g, '').trim()}</p>
                            </li>`;
                        tocCount++;
                    }
                } else {
                    // It's a paragraph
                    let content = p.trim().replace(/\n/g, ' ');
                    if (i === 0) {
                        // Add drop cap to first paragraph
                        const firstChar = content.charAt(0);
                        const rest = content.substring(1);
                        html += `<p class="first-paragraph"><span class="drop-cap">${firstChar}</span>${rest}</p>`;
                        
                        // Set the quote
                        const sentences = content.split('. ');
                        if (sentences.length > 1) {
                            articleQuote.textContent = `"${sentences[Math.floor(sentences.length / 2)]}."`;
                        }
                    } else if (i === Math.floor(paragraphs.length / 2)) {
                        // Insert a blockquote in the middle
                        html += `
                            <blockquote class="pull-quote glass-panel">
                                <i class="fas fa-quote-left quote-icon"></i>
                                <p class="quote">The rapid evolution of ${title} represents a fundamental shift in our understanding.</p>
                            </blockquote>`;
                        html += `<p>${content}</p>`;
                    } else {
                        html += `<p>${content}</p>`;
                    }
                }
            });

            articleBody.innerHTML = html;
            
            if (!tocHtml) {
                tocHtml = `
                    <li class="timeline-item">
                        <div class="timeline-marker"></div>
                        <h4 class="timeline-title">Overview</h4>
                        <p>Introduction</p>
                    </li>
                    <li class="timeline-item">
                        <div class="timeline-marker"></div>
                        <h4 class="timeline-title">Details</h4>
                        <p>In-depth analysis</p>
                    </li>`;
            }
            articleToc.innerHTML = tocHtml;

        } catch (error) {
            articleBody.innerHTML = `<p style="padding: 5rem; text-align: center;">Error loading full article content. Please check your connection.</p>`;
        }
    }

    function closeArticle() {
        if (!exploreView || !articleView) return;
        articleView.classList.add('hidden');
        exploreView.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    if (closeArticleBtn) {
        closeArticleBtn.addEventListener('click', closeArticle);
    }
});
