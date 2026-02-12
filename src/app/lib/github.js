import { Octokit } from 'octokit';

export const createOctokit = (token) => {
    return new Octokit({ auth: token });
};

export const fetchNotes = async (octokit, owner, repo, path = '') => {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path,
        });

        // Filter for markdown files only
        return Array.isArray(response.data)
            ? response.data.filter(file => file.name.endsWith('.md'))
            : [];
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};

export const getNoteContent = async (octokit, owner, repo, path, sha) => {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
            owner,
            repo,
            file_sha: sha,
        });

        // Content is base64 encoded
        return atob(response.data.content);
    } catch (error) {
        console.error('Error getting note content:', error);
        throw error;
    }
};

export const saveNote = async (octokit, owner, repo, path, filename, content, sha = null) => {
    try {
        const filePath = path ? `${path}/${filename}` : filename;

        const params = {
            owner,
            repo,
            path: filePath,
            message: `Update ${filename}`,
            content: btoa(unescape(encodeURIComponent(content))), // Handle UTF-8 content properly
        };

        if (sha) {
            params.sha = sha;
        }

        const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', params);
        return response.data;
    } catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
};

export const deleteNote = async (octokit, owner, repo, path, filename, sha) => {
    try {
        const filePath = path ? `${path}/${filename}` : filename;

        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path: filePath,
            message: `Delete ${filename}`,
            sha,
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
};
