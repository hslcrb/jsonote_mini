import { Octokit } from "octokit";

/**
 * Octokit 인스턴스를 생성합니다. / Creates an Octokit instance.
 * @param {string} token - GitHub Personal Access Token
 */
export const createOctokit = (token) => {
    return new Octokit({ auth: token });
};

/**
 * 리포지토리에서 노트 목록(마크다운 파일)을 가져옵니다. / Fetches the list of notes (markdown files) from the repository.
 * @param {Octokit} octokit - Octokit instance
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {string} path - Folder path (optional)
 */
export const fetchNotes = async (octokit, owner, repo, path = '') => {
    try {
        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: path.replace(/^\/|\/$/g, ''), // 앞뒤 슬래시 제거 / Trim slashes
        });

        // .md 파일만 필터링 / Filter only markdown files
        return data
            .filter(file => file.name.endsWith('.md'))
            .map(file => ({
                name: file.name,
                path: file.path,
                sha: file.sha,
                size: file.size,
                url: file.html_url
            }));
    } catch (error) {
        console.error('노트 목록을 가져오는 중 오류 발생 / Error fetching notes:', error);
        throw error;
    }
};

/**
 * 특정 노트의 파일 내용을 가져옵니다. / Fetches the content of a specific note file.
 * @param {Octokit} octokit - Octokit instance
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {string} path - Folder path
 * @param {string} sha - File SHA
 */
export const getNoteContent = async (octokit, owner, repo, path, sha) => {
    try {
        const { data } = await octokit.rest.git.getBlob({
            owner,
            repo,
            file_sha: sha,
        });

        // Base64 디코딩 (한글 깨짐 방지를 위해 decodeURIComponent 사용) / Decode Base64 (using decodeURIComponent to prevent Korean character breakage)
        return decodeURIComponent(escape(atob(data.content)));
    } catch (error) {
        console.error('노트 내용을 가져오는 중 오류 발생 / Error fetching note content:', error);
        throw error;
    }
};

/**
 * 노트를 저장(생성 또는 수정)합니다. / Saves (creates or updates) a note.
 * @param {Octokit} octokit - Octokit instance
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {string} folderPath - Folder path
 * @param {string} filename - Filename
 * @param {string} content - Markdown content
 * @param {string} sha - File SHA (null if new file)
 */
export const saveNote = async (octokit, owner, repo, folderPath, filename, content, sha = null) => {
    try {
        const path = folderPath
            ? `${folderPath.replace(/^\/|\/$/g, '')}/${filename}`
            : filename;

        // 내용을 Base64로 인코딩 (한글 지원) / Encode content to Base64 (Korean support)
        const b64Content = btoa(unescape(encodeURIComponent(content)));

        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: `Save note: ${filename} (via JSONote Mini)`,
            content: b64Content,
            sha: sha || undefined,
        });
    } catch (error) {
        console.error('노트 저장 중 오류 발생 / Error saving note:', error);
        throw error;
    }
};
