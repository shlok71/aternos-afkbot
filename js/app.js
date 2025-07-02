document.addEventListener('DOMContentLoaded', () => {
    console.log('Puter.js Feature Showcase Initialized');

    const authStatusMessageEl = document.getElementById('auth-status-message');
    const userInfoEl = document.getElementById('user-info');
    const usernameDisplayEl = document.getElementById('username-display');
    const userDetailsDisplayEl = document.getElementById('user-details-display');
    const authFormsEl = document.getElementById('auth-forms');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const authErrorMessageEl = document.getElementById('auth-error-message');

    // Function to update UI based on authentication state
    async function updateAuthUI() {
        try {
            authStatusMessageEl.textContent = 'Checking auth status...';
            if (puter.auth.isSignedIn()) {
                const user = await puter.auth.getUser();
                if (user) {
                    usernameDisplayEl.textContent = user.username || user.name || user.email; // Display best available name
                    userDetailsDisplayEl.textContent = JSON.stringify(user, null, 2);
                    userInfoEl.classList.remove('hidden');
                    authFormsEl.classList.add('hidden');
                    authStatusMessageEl.textContent = 'Signed in.';
                    authErrorMessageEl.classList.add('hidden');
                    authErrorMessageEl.textContent = '';
                    // Load other features once authenticated
                    loadFeatureSections();
                } else {
                    // This case should ideally not happen if isSignedIn is true, but good to handle
                    showLoggedOutState('Error fetching user details after sign-in.');
                }
            } else {
                showLoggedOutState();
            }
        } catch (error) {
            console.error('Error updating auth UI:', error);
            showLoggedOutState('Error checking authentication status.');
            authErrorMessageEl.textContent = `Error: ${error.message || error}`;
            authErrorMessageEl.classList.remove('hidden');
        }
    }

    function showLoggedOutState(message = 'You are not signed in.') {
        userInfoEl.classList.add('hidden');
        authFormsEl.classList.remove('hidden');
        authStatusMessageEl.textContent = message;
        // Clear feature sections as user is logged out
        const featuresGrid = document.getElementById('features-grid');
        featuresGrid.innerHTML = '';
    }

    // Event listener for login button
    loginButton.addEventListener('click', async () => {
        authErrorMessageEl.classList.add('hidden');
        authErrorMessageEl.textContent = '';
        authStatusMessageEl.textContent = 'Attempting to sign in...';
        try {
            await puter.auth.signIn();
            authStatusMessageEl.textContent = 'Sign-in successful, fetching user details...';
            await updateAuthUI();
        } catch (error) {
            console.error('Sign in failed:', error);
            authStatusMessageEl.textContent = 'Sign in failed.';
            authErrorMessageEl.textContent = `Sign in failed: ${error.message || error}`;
            authErrorMessageEl.classList.remove('hidden');
            updateAuthUI(); // Refresh UI to show logged out state
        }
    });

    // Event listener for logout button
    logoutButton.addEventListener('click', () => {
        authErrorMessageEl.classList.add('hidden');
        authErrorMessageEl.textContent = '';
        authStatusMessageEl.textContent = 'Signing out...';
        try {
            puter.auth.signOut();
            authStatusMessageEl.textContent = 'Signed out successfully.';
            updateAuthUI();
        } catch (error) {
            console.error('Sign out failed:', error);
            authStatusMessageEl.textContent = 'Sign out failed.';
            authErrorMessageEl.textContent = `Sign out failed: ${error.message || error}`;
            authErrorMessageEl.classList.remove('hidden');
        }
    });

    // Initial check for Puter object and auth state when DOM is loaded
    if (typeof puter !== 'undefined') {
        authStatusMessageEl.textContent = 'Puter.js loaded. Checking authentication status...';
        // It's good practice to ensure puter is fully initialized, though often it is.
        // For robust handling, one might listen to a puter 'ready' event if available,
        // or use a small timeout, but typically direct access works after script load.
        updateAuthUI();
    } else {
        authStatusMessageEl.textContent = 'Puter.js is not loaded. Please check the script tag.';
        console.error('Puter object not found. Ensure Puter.js is included correctly.');
        authErrorMessageEl.textContent = 'Puter.js failed to load.';
        authErrorMessageEl.classList.remove('hidden');
    }

    // Function to load and initialize all feature sections
    function loadFeatureSections() {
        const featuresGrid = document.getElementById('features-grid');
        featuresGrid.innerHTML = ''; // Clear previous features, if any

        // --- Add OpenAI Chat Feature ---
        addAiChatFeature(featuresGrid, {
            id: 'openai',
            title: 'OpenAI Chat (GPT-4o-mini)',
            model: 'gpt-4o-mini', // Default model for this section
            defaultPrompt: 'Why is the sky blue?'
        });

        // --- Add Claude Chat Feature (Sonnet) ---
        addAiChatFeature(featuresGrid, {
            id: 'claude-sonnet',
            title: 'Claude Chat (Sonnet 4)',
            model: 'claude-sonnet-4',
            defaultPrompt: 'Write a short story about a friendly robot.'
        });

        // --- Add Claude Chat Feature (Opus as a stand-in for 3.7 Sonnet based on available tutorial) ---
        addAiChatFeature(featuresGrid, {
            id: 'claude-opus', // Changed id to avoid conflict if a true 3.7 sonnet appears
            title: 'Claude Chat (Opus 4)', // Title reflecting the model used
            model: 'claude-opus-4',
            defaultPrompt: 'Explain the concept of general relativity in three paragraphs.'
        });

        // --- Add OpenRouter Chat Feature ---
        addOpenRouterChatFeature(featuresGrid, {
            id: 'openrouter',
            title: 'OpenRouter Chat', // Title is generic, specific model shown in dropdown
            defaultPrompt: 'What are the main differences between various LLM architectures?'
        });

        // --- Add Gemini Pro 1.5 Chat Feature (Text Only) ---
        addAiChatFeature(featuresGrid, {
            id: 'gemini-pro-text',
            title: 'Gemini Pro 1.5 (Text)',
            model: 'google/gemini-pro-1.5', // Default to the main pro model for text
            defaultPrompt: 'What are three key benefits of using renewable energy sources?'
        });

        // --- Add Gemini Pro 1.5 Vision Feature ---
        addAiVisionFeature(featuresGrid, {
            id: 'gemini-pro-vision',
            title: 'Gemini Pro 1.5 (Vision)',
            model: 'google/gemini-pro-1.5', // Using the Pro model for vision
            defaultPrompt: 'Describe this image.',
            defaultImageUrl: 'https://storage.googleapis.com/gweb-proud-storage/images/google_gemini_logo.width-1000.height-1000.png' // Example image
        });

        // --- Add o3-mini Chat Feature (via OpenRouter) ---
        addAiChatFeature(featuresGrid, {
            id: 'o3-mini',
            title: 'OpenAI o3-mini (via OpenRouter)',
            model: 'openrouter:openai/o3-mini',
            defaultPrompt: 'Explain the concept of photosynthesis in a few sentences.'
        });

        // --- Add o1-mini Chat Feature (via OpenRouter) ---
        addAiChatFeature(featuresGrid, {
            id: 'o1-mini',
            title: 'OpenAI o1-mini (via OpenRouter)',
            model: 'openrouter:openai/o1-mini',
            defaultPrompt: 'Solve this logic puzzle: A man is looking at a portrait. Someone asks him whose portrait he is looking at. He replies, "Brothers and sisters I have none, but that man\'s father is my father\'s son." Whose portrait is the man looking at?'
        });

        // --- Add Mistral Large Chat Feature ---
        addAiChatFeature(featuresGrid, {
            id: 'mistral-large',
            title: 'Mistral Large',
            model: 'mistral-large-latest',
            defaultPrompt: 'Write a blog post about the future of renewable energy.'
        });

        // --- Add Codestral Chat Feature ---
        addAiChatFeature(featuresGrid, {
            id: 'codestral',
            title: 'Codestral (Code Generation)',
            model: 'codestral-latest',
            defaultPrompt: 'Write a Python function that takes a list of numbers and returns the sum of all even numbers in the list.'
        });

        // --- Add Grok Chat Feature ---
        addAiChatFeature(featuresGrid, {
            id: 'grok',
            title: 'Grok (xAI)',
            model: 'x-ai/grok-3-beta',
            defaultPrompt: 'Tell me a joke about programming or quantum physics, in a witty style.'
        });

        // --- Add Llama Chat Feature ---
        addAiChatFeature(featuresGrid, {
            id: 'llama',
            title: 'Llama 4 Maverick (Meta)',
            model: 'meta-llama/llama-4-maverick',
            defaultPrompt: 'Write a short poem about the beauty of nature.'
        });

        // --- Add Text-to-Speech (TTS) Feature ---
        addTtsFeature(featuresGrid, {
            id: 'tts',
            title: 'Text-to-Speech',
            defaultText: 'Hello, Puter developer! This is a demonstration of the Text-to-Speech API.'
        });

        // --- Add OCR (Image-to-Text) Feature ---
        addOcrFeature(featuresGrid, {
            id: 'ocr',
            title: 'OCR (Image-to-Text)',
            defaultImageUrl: 'https://assets.puter.site/demo-assets/ocr-example.png' // A sample image URL for OCR
        });

        // --- Add Informational Sections (Vibe Coding & Serverless AI) ---
        addInfoSection(featuresGrid, {
            id: 'bolt-app',
            title: 'Full Stack App with Bolt.new',
            summary: 'Learn how to quickly create and deploy full-stack applications using Puter.js within the Bolt.new environment. Ideal for rapid prototyping and AI-powered vibe coding.',
            linkUrl: 'https://developer.puter.com/tutorials/create-a-full-stack-app-with-bolt'
        });

        // Note: The plan had "Build a Full Stack App with Puter.js in Bolt.new" which is the same as above.
        // I will use the link for "Create a Full Stack App with Bolt.new" as it's likely the primary tutorial.

        addInfoSection(featuresGrid, {
            id: 'v0-dev-app',
            title: 'Full Stack App with v0.dev',
            summary: 'Discover how to integrate Puter.js into projects built with v0.dev, enabling serverless features and enhancing your generative UI workflows.',
            linkUrl: 'https://developer.puter.com/tutorials/create-a-full-stack-app-with-v0'
        });

        addInfoSection(featuresGrid, {
            id: 'lovable-dev-app',
            title: 'Full Stack App with Lovable.dev',
            summary: 'Explore building full-stack applications combining the power of Puter.js with Lovable.dev for seamless cloud storage and vibe coding experiences.',
            linkUrl: 'https://developer.puter.com/tutorials/create-a-full-stack-app-with-lovable'
        });

        // This completes Step 21 from the plan. Now for Step 22.
        addInfoSection(featuresGrid, {
            id: 'serverless-ai',
            title: 'Serverless AI: Forever Free',
            summary: 'Understand Puter\'s philosophy on providing serverless AI capabilities to developers, free forever, by leveraging a user-centric resource model.',
            linkUrl: 'https://developer.puter.com/tutorials/serverless-ai-forever-free-for-developers'
        });

        // --- Add Cloud Storage Feature ---
        addCloudStorageFeature(featuresGrid, {
            id: 'cloud-storage',
            title: 'Cloud File Storage'
        });

        // --- Add Key-Value Store Feature ---
        addKvStoreFeature(featuresGrid, {
            id: 'kv-store',
            title: 'Key-Value Store (Cloud DB & Game Save)'
        });

        // --- Add CORS-Free Fetch API Feature ---
        addFetchApiFeature(featuresGrid, {
            id: 'fetch-api',
            title: 'CORS-Free Fetch Utility'
        });

        // All core features from the list are now added.
        // The placeholder below might not be needed if all sections are always populated.
        // For now, a general placeholder if no AI features were added (e.g. if addAiChatFeature was empty)
        if (featuresGrid.children.length === 0) {
            const placeholder = document.createElement('p');
            placeholder.textContent = 'AI features will be loaded here...';
            featuresGrid.appendChild(placeholder);
        }
    }

    /**
     * Adds an AI Chat feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the AI chat feature.
     * @param {string} config.id - Unique ID for this feature (e.g., 'openai', 'claude').
     * @param {string} config.title - Title to display for this AI feature.
     * @param {string} config.model - The Puter.js AI model name to use.
     * @param {string} [config.defaultPrompt] - An optional default prompt.
     */
    function addAiChatFeature(parentContainer, config) {
        const template = document.getElementById('ai-chat-template');
        if (!template) {
            console.error('AI chat template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.ai-feature-section');
        section.id = `ai-${config.id}-section`;

        const titleEl = section.querySelector('.ai-title');
        const promptTextarea = section.querySelector('.ai-prompt');
        const submitButton = section.querySelector('.ai-submit-button');
        const responseContentEl = section.querySelector('.ai-response-content');
        const statusMessageEl = section.querySelector('.ai-status-message');
        const errorMessageEl = section.querySelector('.ai-error-message');

        titleEl.textContent = config.title;
        if (config.defaultPrompt) {
            promptTextarea.value = config.defaultPrompt;
        }

        submitButton.addEventListener('click', async () => {
            const prompt = promptTextarea.value.trim();
            if (!prompt) {
                errorMessageEl.textContent = 'Prompt cannot be empty.';
                errorMessageEl.classList.remove('hidden');
                return;
            }

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Sending request to ${config.model}...`;
            responseContentEl.textContent = ''; // Clear previous response
            submitButton.disabled = true;

            try {
                // Use streaming for a better UX
                const responseStream = await puter.ai.chat(prompt, { model: config.model, stream: true });
                statusMessageEl.textContent = 'Receiving response...';
                for await (const chunk of responseStream) {
                    if (chunk.text) {
                        responseContentEl.textContent += chunk.text;
                    }
                    // Scroll to bottom of pre element if content is long
                    responseContentEl.scrollTop = responseContentEl.scrollHeight;
                }
                statusMessageEl.textContent = 'Response received.';
            } catch (error) {
                console.error(`Error with ${config.title}:`, error);
                errorMessageEl.textContent = `Error: ${error.message || 'An unknown error occurred.'}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to get response.';
            } finally {
                submitButton.disabled = false;
            }
        });

        parentContainer.appendChild(section);
    }

    /**
     * Adds a CORS-Free Fetch API feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the Fetch API feature.
     * @param {string} config.id - Unique ID for this feature.
     * @param {string} config.title - Title to display for this feature.
     */
    function addFetchApiFeature(parentContainer, config) {
        const template = document.getElementById('fetch-api-template');
        if (!template) {
            console.error('Fetch API template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.fetch-api-section');
        section.id = `fetch-${config.id}-section`;

        const titleEl = section.querySelector('.fetch-title');
        const urlInputEl = section.querySelector('.fetch-url-input');
        const methodSelectEl = section.querySelector('.fetch-method-select');
        const headersInputEl = section.querySelector('.fetch-headers-input');
        const bodyInputEl = section.querySelector('.fetch-body-input');
        const bodyGroupEl = section.querySelector('.fetch-body-group');
        const sendButton = section.querySelector('.fetch-send-button');

        const statusDisplayEl = section.querySelector('.fetch-status-display');
        const responseHeadersEl = section.querySelector('.fetch-response-headers-content');
        const responseBodyEl = section.querySelector('.fetch-response-body-content');

        const statusMessageEl = section.querySelector('.fetch-status-message');
        const errorMessageEl = section.querySelector('.fetch-error-message');

        titleEl.textContent = config.title;
        urlInputEl.value = 'https://httpbin.org/get'; // Default example

        // Show/hide body input based on method
        methodSelectEl.addEventListener('change', () => {
            const method = methodSelectEl.value;
            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                bodyGroupEl.style.display = 'flex';
            } else {
                bodyGroupEl.style.display = 'none';
            }
        });
        // Initial check
        if (!['POST', 'PUT', 'PATCH'].includes(methodSelectEl.value)) {
            bodyGroupEl.style.display = 'none';
        }


        sendButton.addEventListener('click', async () => {
            const url = urlInputEl.value.trim();
            const method = methodSelectEl.value;
            let headers = {};
            let body = null;

            if (!url) {
                errorMessageEl.textContent = 'URL cannot be empty.';
                errorMessageEl.classList.remove('hidden');
                return;
            }

            try {
                if (headersInputEl.value.trim()) {
                    headers = JSON.parse(headersInputEl.value.trim());
                }
            } catch (e) {
                errorMessageEl.textContent = 'Headers are not valid JSON.';
                errorMessageEl.classList.remove('hidden');
                return;
            }

            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                body = bodyInputEl.value; // Body is taken as is (string)
            }

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Sending ${method} request to ${url}...`;
            sendButton.disabled = true;
            statusDisplayEl.textContent = 'Status: Pending...';
            responseHeadersEl.textContent = 'Loading...';
            responseBodyEl.textContent = 'Loading...';

            try {
                const options = { method, headers };
                if (body !== null) {
                    options.body = body;
                }

                const response = await puter.net.fetch(url, options);

                statusDisplayEl.textContent = `Status: ${response.status} ${response.statusText}`;

                let responseHeadersText = '';
                for (const [key, value] of response.headers.entries()) {
                    responseHeadersText += `${key}: ${value}\n`;
                }
                responseHeadersEl.textContent = responseHeadersText || '(No headers)';

                const responseData = await response.text(); // Get as text first
                responseBodyEl.textContent = responseData || '(Empty body)';

                // Try to pretty print if JSON
                try {
                    const jsonData = JSON.parse(responseData);
                    responseBodyEl.textContent = JSON.stringify(jsonData, null, 2);
                } catch (e) {
                    // Not JSON, leave as text
                }

                statusMessageEl.textContent = 'Response received.';

            } catch (err) {
                console.error('Fetch API error:', err);
                errorMessageEl.textContent = `Error: ${err.message || 'An unknown error occurred.'}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to send request.';
                statusDisplayEl.textContent = `Status: Error`;
                responseHeadersEl.textContent = '';
                responseBodyEl.textContent = err.message;
            } finally {
                sendButton.disabled = false;
            }
        });

        parentContainer.appendChild(section);
    }

    /**
     * Adds a Key-Value Store feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the KV Store feature.
     * @param {string} config.id - Unique ID for this feature.
     * @param {string} config.title - Title to display for this feature.
     */
    function addKvStoreFeature(parentContainer, config) {
        const template = document.getElementById('kv-store-template');
        if (!template) {
            console.error('KV Store template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.kv-store-section');
        section.id = `kv-${config.id}-section`;

        const titleEl = section.querySelector('.kv-title');
        const keyInputEl = section.querySelector('.kv-key-input');
        const valueInputEl = section.querySelector('.kv-value-input');
        const setButton = section.querySelector('.kv-set-button');
        const getButton = section.querySelector('.kv-get-button');
        const deleteButton = section.querySelector('.kv-delete-button');

        const listPrefixInputEl = section.querySelector('.kv-list-prefix-input');
        const listButton = section.querySelector('.kv-list-button');

        const incrKeyInputEl = section.querySelector('.kv-incr-key-input');
        const incrAmountInputEl = section.querySelector('.kv-incr-amount-input');
        const incrButton = section.querySelector('.kv-incr-button');

        const outputContentEl = section.querySelector('.kv-output-content');
        const statusMessageEl = section.querySelector('.kv-status-message');
        const errorMessageEl = section.querySelector('.kv-error-message');

        titleEl.textContent = config.title;

        function showOutput(data) {
            if (typeof data === 'object') {
                outputContentEl.textContent = JSON.stringify(data, null, 2);
            } else {
                outputContentEl.textContent = data;
            }
        }

        setButton.addEventListener('click', async () => {
            const key = keyInputEl.value.trim();
            const value = valueInputEl.value; // Don't trim value, whitespace might be intentional
            if (!key) {
                errorMessageEl.textContent = 'Key cannot be empty for SET operation.';
                errorMessageEl.classList.remove('hidden');
                return;
            }
            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Setting value for key: ${key}...`;
            try {
                await puter.kv.set(key, value);
                statusMessageEl.textContent = `Value set for key: ${key}`;
                showOutput({ success: true, operation: 'SET', key: key });
            } catch (err) {
                console.error('KV Set error:', err);
                errorMessageEl.textContent = `Error setting value: ${err.message}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to set value.';
            }
        });

        getButton.addEventListener('click', async () => {
            const key = keyInputEl.value.trim();
            if (!key) {
                errorMessageEl.textContent = 'Key cannot be empty for GET operation.';
                errorMessageEl.classList.remove('hidden');
                return;
            }
            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Getting value for key: ${key}...`;
            try {
                const value = await puter.kv.get(key);
                statusMessageEl.textContent = `Value retrieved for key: ${key}`;
                showOutput(value !== null ? value : `(null) - Key "${key}" not found.`);
            } catch (err) {
                console.error('KV Get error:', err);
                errorMessageEl.textContent = `Error getting value: ${err.message}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to get value.';
            }
        });

        deleteButton.addEventListener('click', async () => {
            const key = keyInputEl.value.trim();
            if (!key) {
                errorMessageEl.textContent = 'Key cannot be empty for DELETE operation.';
                errorMessageEl.classList.remove('hidden');
                return;
            }
            if (!confirm(`Are you sure you want to delete key "${key}"?`)) return;

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Deleting key: ${key}...`;
            try {
                await puter.kv.del(key);
                statusMessageEl.textContent = `Key "${key}" deleted.`;
                showOutput({ success: true, operation: 'DELETE', key: key });
            } catch (err) {
                console.error('KV Delete error:', err);
                errorMessageEl.textContent = `Error deleting key: ${err.message}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to delete key.';
            }
        });

        listButton.addEventListener('click', async () => {
            const prefix = listPrefixInputEl.value.trim() || '*'; // Default to all if empty
            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Listing keys with prefix: "${prefix}"...`;
            try {
                // Set withValues to true to get key-value pairs
                const items = await puter.kv.list(prefix, true);
                statusMessageEl.textContent = `Listed ${items.length} items.`;
                if (items.length === 0) {
                    showOutput(`No items found with prefix "${prefix}".`);
                } else {
                    // Format for display
                    const displayItems = items.map(item => ({ key: item.key, value: item.value }));
                    showOutput(displayItems);
                }
            } catch (err) {
                console.error('KV List error:', err);
                errorMessageEl.textContent = `Error listing keys: ${err.message}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to list keys.';
            }
        });

        incrButton.addEventListener('click', async () => {
            const key = incrKeyInputEl.value.trim();
            const amountStr = incrAmountInputEl.value.trim();
            const amount = amountStr ? parseInt(amountStr, 10) : 1;

            if (!key) {
                errorMessageEl.textContent = 'Key cannot be empty for INCR operation.';
                errorMessageEl.classList.remove('hidden');
                return;
            }
             if (isNaN(amount)) {
                errorMessageEl.textContent = 'Increment amount must be a valid number.';
                errorMessageEl.classList.remove('hidden');
                return;
            }

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Incrementing key "${key}" by ${amount}...`;
            try {
                const newValue = await puter.kv.incr(key, amount);
                statusMessageEl.textContent = `Key "${key}" incremented. New value: ${newValue}.`;
                showOutput({ operation: 'INCR', key: key, newValue: newValue });
            } catch (err) {
                console.error('KV Increment error:', err);
                errorMessageEl.textContent = `Error incrementing key: ${err.message}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to increment key.';
            }
        });

        parentContainer.appendChild(section);
    }

    /**
     * Adds a Cloud Storage feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the Cloud Storage feature.
     * @param {string} config.id - Unique ID for this feature.
     * @param {string} config.title - Title to display for this feature.
     */
    function addCloudStorageFeature(parentContainer, config) {
        const template = document.getElementById('cloud-storage-template');
        if (!template) {
            console.error('Cloud Storage template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.cloud-storage-section');
        section.id = `storage-${config.id}-section`;

        const titleEl = section.querySelector('.storage-title');
        const fileInputEl = section.querySelector('.storage-file-input');
        const uploadButton = section.querySelector('.storage-upload-button');
        const fileListUl = section.querySelector('.storage-file-list');
        const refreshListButton = section.querySelector('.storage-refresh-list-button');
        const statusMessageEl = section.querySelector('.storage-status-message');
        const errorMessageEl = section.querySelector('.storage-error-message');

        titleEl.textContent = config.title;

        async function loadFileList(currentPath = '/') {
            fileListUl.innerHTML = '<li>Loading files...</li>';
            statusMessageEl.textContent = `Loading file list for ${currentPath}...`;
            errorMessageEl.classList.add('hidden');
            try {
                const items = await puter.fs.ls(currentPath);
                fileListUl.innerHTML = ''; // Clear loading message

                if (items.length === 0) {
                    fileListUl.innerHTML = '<li>No files or folders found.</li>';
                }

                items.forEach(item => {
                    const li = document.createElement('li');
                    const itemNameSpan = document.createElement('span');
                    itemNameSpan.className = 'file-name';
                    itemNameSpan.textContent = item.name + (item.isDir ? '/' : '');
                    li.appendChild(itemNameSpan);

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'file-actions';

                    if (!item.isDir) {
                        const downloadButton = document.createElement('button');
                        downloadButton.textContent = 'Download';
                        downloadButton.className = 'file-action-button download';
                        downloadButton.onclick = async () => {
                            statusMessageEl.textContent = `Downloading ${item.name}...`;
                            try {
                                const blob = await puter.fs.read(item.path_full);
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = item.name;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                statusMessageEl.textContent = `${item.name} downloaded.`;
                            } catch (err) {
                                console.error('Download error:', err);
                                errorMessageEl.textContent = `Error downloading ${item.name}: ${err.message}`;
                                errorMessageEl.classList.remove('hidden');
                                statusMessageEl.textContent = `Failed to download ${item.name}.`;
                            }
                        };
                        actionsDiv.appendChild(downloadButton);
                    } else {
                        // Could add navigation into directories here if desired
                    }

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'file-action-button delete';
                    deleteButton.onclick = async () => {
                        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                            statusMessageEl.textContent = `Deleting ${item.name}...`;
                            try {
                                await puter.fs.rm(item.path_full);
                                statusMessageEl.textContent = `${item.name} deleted.`;
                                loadFileList(currentPath); // Refresh list
                            } catch (err) {
                                console.error('Delete error:', err);
                                errorMessageEl.textContent = `Error deleting ${item.name}: ${err.message}`;
                                errorMessageEl.classList.remove('hidden');
                                statusMessageEl.textContent = `Failed to delete ${item.name}.`;
                            }
                        }
                    };
                    actionsDiv.appendChild(deleteButton);
                    li.appendChild(actionsDiv);
                    fileListUl.appendChild(li);
                });
                statusMessageEl.textContent = 'File list loaded.';
            } catch (err) {
                console.error('Error listing files:', err);
                fileListUl.innerHTML = `<li>Error loading files: ${err.message}</li>`;
                errorMessageEl.textContent = `Error listing files: ${err.message}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to load file list.';
            }
        }

        uploadButton.addEventListener('click', async () => {
            if (!fileInputEl.files || fileInputEl.files.length === 0) {
                errorMessageEl.textContent = 'Please select a file to upload.';
                errorMessageEl.classList.remove('hidden');
                return;
            }
            const file = fileInputEl.files[0];
            statusMessageEl.textContent = `Uploading ${file.name}...`;
            errorMessageEl.classList.add('hidden');
            uploadButton.disabled = true;
            fileInputEl.disabled = true;

            try {
                // The tutorial used puter.fs.upload(fileInput.files), which is simpler.
                // However, puter.fs.write(filename, content) is more fundamental.
                // Let's stick to puter.fs.write for now as per the tutorial's other fs examples.
                // If puter.fs.upload is preferred, it can be switched.
                // For single file upload, fileInputEl.files[0] is the File object.
                const uploadedFile = await puter.fs.write(file.name, file);
                statusMessageEl.textContent = `File ${file.name} uploaded successfully! Path: ${uploadedFile.path_full || file.name}`;
                fileInputEl.value = ''; // Clear the file input
                loadFileList(); // Refresh the list
            } catch (err) {
                console.error('Upload error:', err);
                errorMessageEl.textContent = `Error uploading ${file.name}: ${err.message}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = `Failed to upload ${file.name}.`;
            } finally {
                uploadButton.disabled = false;
                fileInputEl.disabled = false;
            }
        });

        refreshListButton.addEventListener('click', () => loadFileList());

        // Initial load
        loadFileList();

        parentContainer.appendChild(section);
    }

    /**
     * Adds an Informational Section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the info section.
     * @param {string} config.id - Unique ID for this section.
     * @param {string} config.title - Title to display.
     * @param {string} config.summary - A brief summary text.
     * @param {string} config.linkUrl - The URL for the "Read more" link.
     */
    function addInfoSection(parentContainer, config) {
        const template = document.getElementById('info-section-template');
        if (!template) {
            console.error('Info section template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.info-section');
        section.id = `info-${config.id}-section`;

        const titleEl = section.querySelector('.info-title');
        const summaryEl = section.querySelector('.info-summary');
        const linkEl = section.querySelector('.info-link');

        titleEl.textContent = config.title;
        summaryEl.textContent = config.summary;
        linkEl.href = config.linkUrl;
        // Optional: Set link text if it needs to be dynamic, otherwise it uses "Read more..." from template
        // linkEl.textContent = config.linkText || 'Read more...';

        parentContainer.appendChild(section);
    }

    /**
     * Adds an OCR (Image-to-Text) feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the OCR feature.
     * @param {string} config.id - Unique ID for this feature.
     * @param {string} config.title - Title to display for this feature.
     * @param {string} [config.defaultImageUrl] - An optional default image URL.
     */
    function addOcrFeature(parentContainer, config) {
        const template = document.getElementById('ai-ocr-template');
        if (!template) {
            console.error('AI OCR template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.ai-feature-section');
        section.id = `ai-${config.id}-section`;

        const titleEl = section.querySelector('.ai-title');
        const imageUrlInput = section.querySelector('.ocr-image-url');
        const fileInput = section.querySelector('.ocr-file-input');
        const extractButton = section.querySelector('.ocr-extract-button');
        const imagePreview = section.querySelector('.ocr-image-preview');
        const responseContentEl = section.querySelector('.ocr-response-content');
        const statusMessageEl = section.querySelector('.ai-status-message');
        const errorMessageEl = section.querySelector('.ai-error-message');
        const inputTypeRadios = section.querySelectorAll('input[name="ocr-input-type"]');

        titleEl.textContent = config.title;
        if (config.defaultImageUrl) {
            imageUrlInput.value = config.defaultImageUrl;
            imagePreview.src = config.defaultImageUrl;
            imagePreview.style.display = 'block';
        }

        let currentInputType = 'url'; // Default to URL

        inputTypeRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                currentInputType = event.target.value;
                if (currentInputType === 'url') {
                    imageUrlInput.style.display = 'block';
                    fileInput.style.display = 'none';
                    if(imageUrlInput.value) { // Keep preview if URL already there
                        imagePreview.src = imageUrlInput.value;
                        imagePreview.style.display = 'block';
                    } else {
                        imagePreview.style.display = 'none';
                        imagePreview.src = "#";
                    }
                } else { // file
                    imageUrlInput.style.display = 'none';
                    fileInput.style.display = 'block';
                    if(fileInput.files && fileInput.files[0]){ // Keep preview if file already selected
                         imagePreview.src = URL.createObjectURL(fileInput.files[0]);
                         imagePreview.style.display = 'block';
                    } else {
                        imagePreview.style.display = 'none';
                        imagePreview.src = "#";
                    }
                }
            });
        });

        imageUrlInput.addEventListener('input', () => {
            if (currentInputType === 'url' && imageUrlInput.value) {
                imagePreview.src = imageUrlInput.value;
                imagePreview.style.display = 'block';
            } else if (currentInputType === 'url' && !imageUrlInput.value) {
                imagePreview.style.display = 'none';
                imagePreview.src = "#";
            }
        });

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && currentInputType === 'file') {
                imagePreview.src = URL.createObjectURL(file);
                imagePreview.style.display = 'block';
                responseContentEl.textContent = 'Waiting for extraction...';
            } else if (currentInputType === 'file' && !file) {
                 imagePreview.style.display = 'none';
                 imagePreview.src = "#";
            }
        });

        extractButton.addEventListener('click', async () => {
            let imageDataSource = null;

            if (currentInputType === 'url') {
                imageDataSource = imageUrlInput.value.trim();
                if (!imageDataSource) {
                    errorMessageEl.textContent = 'Image URL cannot be empty.';
                    errorMessageEl.classList.remove('hidden');
                    return;
                }
            } else { // file
                if (!fileInput.files || fileInput.files.length === 0) {
                    errorMessageEl.textContent = 'Please select an image file.';
                    errorMessageEl.classList.remove('hidden');
                    return;
                }
                // Convert file to data URL for puter.ai.img2txt
                try {
                    imageDataSource = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = (err) => reject(new Error("Failed to read file."));
                        reader.readAsDataURL(fileInput.files[0]);
                    });
                } catch(fileReadError) {
                    console.error('File read error:', fileReadError);
                    errorMessageEl.textContent = fileReadError.message;
                    errorMessageEl.classList.remove('hidden');
                    statusMessageEl.textContent = 'Failed to read image file.';
                    return;
                }
            }

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = 'Extracting text...';
            extractButton.disabled = true;
            responseContentEl.textContent = ''; // Clear previous response

            try {
                const text = await puter.ai.img2txt(imageDataSource);
                responseContentEl.textContent = text || 'No text found in image.';
                statusMessageEl.textContent = 'Text extracted successfully.';
            } catch (error) {
                console.error(`Error with ${config.title}:`, error);
                errorMessageEl.textContent = `Error: ${error.message || 'An unknown error occurred.'}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to extract text.';
            } finally {
                extractButton.disabled = false;
            }
        });
        parentContainer.appendChild(section);
    }

    /**
     * Adds a Text-to-Speech (TTS) feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the TTS feature.
     * @param {string} config.id - Unique ID for this feature.
     * @param {string} config.title - Title to display for this feature.
     * @param {string} [config.defaultText] - An optional default text.
     */
    function addTtsFeature(parentContainer, config) {
        const template = document.getElementById('ai-tts-template');
        if (!template) {
            console.error('AI TTS template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.ai-feature-section');
        section.id = `ai-${config.id}-section`;

        const titleEl = section.querySelector('.ai-title');
        const textTextarea = section.querySelector('.tts-text');
        const languageSelectEl = section.querySelector('.tts-language-select');
        const speakButton = section.querySelector('.tts-speak-button');
        const audioPlayerContainer = section.querySelector('.tts-audio-player-container');
        const statusMessageEl = section.querySelector('.ai-status-message');
        const errorMessageEl = section.querySelector('.ai-error-message');

        titleEl.textContent = config.title;
        if (config.defaultText) {
            textTextarea.value = config.defaultText;
        }

        let currentAudio = null; // To keep track of the current audio element

        speakButton.addEventListener('click', async () => {
            const text = textTextarea.value.trim();
            const language = languageSelectEl.value;

            if (!text) {
                errorMessageEl.textContent = 'Text cannot be empty.';
                errorMessageEl.classList.remove('hidden');
                return;
            }

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = 'Synthesizing speech...';
            speakButton.disabled = true;
            textTextarea.disabled = true;
            languageSelectEl.disabled = true;

            // Stop and clear previous audio if any
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.remove(); // Remove from DOM if it was added
                currentAudio = null;
            }
            audioPlayerContainer.innerHTML = ''; // Clear any manually added player

            try {
                currentAudio = await puter.ai.txt2speech(text, language);
                statusMessageEl.textContent = 'Speech synthesized. Playing...';

                // Option 1: Just play (no visible controls unless browser default)
                currentAudio.play();

                // Option 2: Add visible controls to the container
                // currentAudio.controls = true;
                // audioPlayerContainer.appendChild(currentAudio);

                currentAudio.onended = () => {
                    statusMessageEl.textContent = 'Playback finished.';
                    speakButton.disabled = false;
                    textTextarea.disabled = false;
                    languageSelectEl.disabled = false;
                };
                currentAudio.onerror = (err) => {
                    console.error('Audio playback error:', err);
                    errorMessageEl.textContent = 'Error playing audio.';
                    errorMessageEl.classList.remove('hidden');
                    statusMessageEl.textContent = 'Failed to play audio.';
                    speakButton.disabled = false;
                    textTextarea.disabled = false;
                    languageSelectEl.disabled = false;
                };

            } catch (error) {
                console.error(`Error with ${config.title}:`, error);
                errorMessageEl.textContent = `Error: ${error.message || 'An unknown error occurred.'}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to synthesize speech.';
                speakButton.disabled = false;
                textTextarea.disabled = false;
                languageSelectEl.disabled = false;
            }
        });
        parentContainer.appendChild(section);
    }

    /**
     * Adds an AI Vision feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the AI vision feature.
     * @param {string} config.id - Unique ID for this feature.
     * @param {string} config.title - Title to display for this AI feature.
     * @param {string} config.model - The Puter.js AI model name to use (e.g., 'google/gemini-pro-vision').
     * @param {string} [config.defaultPrompt] - An optional default prompt.
     * @param {string} [config.defaultImageUrl] - An optional default image URL.
     */
    function addAiVisionFeature(parentContainer, config) {
        const template = document.getElementById('ai-vision-template');
        if (!template) {
            console.error('AI vision template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.ai-feature-section');
        section.id = `ai-${config.id}-section`;

        const titleEl = section.querySelector('.ai-title');
        const imageUrlInput = section.querySelector('.ai-image-url');
        const promptTextarea = section.querySelector('.ai-prompt');
        const submitButton = section.querySelector('.ai-submit-button');
        const responseContentEl = section.querySelector('.ai-response-content');
        const statusMessageEl = section.querySelector('.ai-status-message');
        const errorMessageEl = section.querySelector('.ai-error-message');

        titleEl.textContent = config.title;
        if (config.defaultPrompt) {
            promptTextarea.value = config.defaultPrompt;
        }
        if (config.defaultImageUrl) {
            imageUrlInput.value = config.defaultImageUrl;
        }

        submitButton.addEventListener('click', async () => {
            const imageUrl = imageUrlInput.value.trim();
            const prompt = promptTextarea.value.trim();

            if (!imageUrl) {
                errorMessageEl.textContent = 'Image URL cannot be empty.';
                errorMessageEl.classList.remove('hidden');
                return;
            }
            // Prompt can be empty for some vision models, but usually good to have one.
            // if (!prompt) {
            //     errorMessageEl.textContent = 'Prompt cannot be empty.';
            //     errorMessageEl.classList.remove('hidden');
            //     return;
            // }

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Sending request to ${config.model} with image...`;
            responseContentEl.textContent = ''; // Clear previous response
            submitButton.disabled = true;
            imageUrlInput.disabled = true;
            promptTextarea.disabled = true;

            try {
                // Call puter.ai.chat with prompt, imageUrl, and options
                const responseStream = await puter.ai.chat(prompt, imageUrl, { model: config.model, stream: true });
                statusMessageEl.textContent = 'Receiving response...';
                for await (const chunk of responseStream) {
                    if (chunk.text) {
                        responseContentEl.textContent += chunk.text;
                    }
                    responseContentEl.scrollTop = responseContentEl.scrollHeight;
                }
                statusMessageEl.textContent = 'Response received.';
            } catch (error) {
                console.error(`Error with ${config.title} (${config.model}):`, error);
                errorMessageEl.textContent = `Error: ${error.message || 'An unknown error occurred.'}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to get response.';
            } finally {
                submitButton.disabled = false;
                imageUrlInput.disabled = false;
                promptTextarea.disabled = false;
            }
        });
        parentContainer.appendChild(section);
    }

    /**
     * Adds an OpenRouter AI Chat feature section to the grid.
     * @param {HTMLElement} parentContainer - The container to append this feature to.
     * @param {object} config - Configuration for the OpenRouter chat feature.
     * @param {string} config.id - Unique ID for this feature.
     * @param {string} config.title - Title to display for this AI feature.
     * @param {string} [config.defaultPrompt] - An optional default prompt.
     */
    function addOpenRouterChatFeature(parentContainer, config) {
        const template = document.getElementById('ai-openrouter-chat-template');
        if (!template) {
            console.error('OpenRouter AI chat template not found!');
            return;
        }
        const clone = template.content.cloneNode(true);
        const section = clone.querySelector('.ai-feature-section');
        section.id = `ai-${config.id}-section`;

        const titleEl = section.querySelector('.ai-title');
        const modelSelectEl = section.querySelector('.openrouter-model-select');
        const promptTextarea = section.querySelector('.ai-prompt');
        const submitButton = section.querySelector('.ai-submit-button');
        const responseContentEl = section.querySelector('.ai-response-content');
        const statusMessageEl = section.querySelector('.ai-status-message');
        const errorMessageEl = section.querySelector('.ai-error-message');

        titleEl.textContent = config.title;
        if (config.defaultPrompt) {
            promptTextarea.value = config.defaultPrompt;
        }

        // Note: Model options are hardcoded in the template for this example.
        // A more dynamic approach might fetch available models or have a larger predefined list.

        submitButton.addEventListener('click', async () => {
            const prompt = promptTextarea.value.trim();
            const selectedModel = modelSelectEl.value;

            if (!prompt) {
                errorMessageEl.textContent = 'Prompt cannot be empty.';
                errorMessageEl.classList.remove('hidden');
                return;
            }
            if (!selectedModel) {
                errorMessageEl.textContent = 'Please select a model.';
                errorMessageEl.classList.remove('hidden');
                return;
            }

            errorMessageEl.classList.add('hidden');
            statusMessageEl.textContent = `Sending request to ${selectedModel}...`;
            responseContentEl.textContent = ''; // Clear previous response
            submitButton.disabled = true;
            modelSelectEl.disabled = true;

            try {
                const responseStream = await puter.ai.chat(prompt, { model: selectedModel, stream: true });
                statusMessageEl.textContent = 'Receiving response...';
                for await (const chunk of responseStream) {
                    if (chunk.text) {
                        responseContentEl.textContent += chunk.text;
                    }
                    responseContentEl.scrollTop = responseContentEl.scrollHeight;
                }
                statusMessageEl.textContent = 'Response received.';
            } catch (error) {
                console.error(`Error with ${config.title} (${selectedModel}):`, error);
                errorMessageEl.textContent = `Error: ${error.message || 'An unknown error occurred.'}`;
                errorMessageEl.classList.remove('hidden');
                statusMessageEl.textContent = 'Failed to get response.';
            } finally {
                submitButton.disabled = false;
                modelSelectEl.disabled = false;
            }
        });
        parentContainer.appendChild(section);
    }


    // Initial check for Puter object and auth state when DOM is loaded
    if (typeof puter !== 'undefined') {
        authStatusMessageEl.textContent = 'Puter.js loaded. Checking authentication status...';
        updateAuthUI();
    } else {
        authStatusMessageEl.textContent = 'Puter.js is not loaded. Please check the script tag.';
        console.error('Puter object not found. Ensure Puter.js is included correctly.');
        authErrorMessageEl.textContent = 'Puter.js failed to load.';
        authErrorMessageEl.classList.remove('hidden');
    }
});
