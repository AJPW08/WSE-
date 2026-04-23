import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';

async function sync() {
  const dir = process.cwd();
  const token = process.env.GITHUB_TOKEN;
  const owner = 'AJPW08';
  const repo = 'WSE-';
  const repoUrl = `https://github.com/${owner}/${repo}.git`;
  const branch = 'staging';

  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is not set.');
    process.exit(1);
  }

  console.log(`Starting push to ${repoUrl} [${branch}]...`);

  try {
    // 1. Initialize Git if not already
    if (!fs.existsSync(path.join(dir, '.git'))) {
      await git.init({ fs, dir, defaultBranch: 'staging' });
    }

    // 2. Add remote if not already
    try {
      await git.addRemote({ fs, dir, remote: 'origin', url: repoUrl });
    } catch (e) {}

    // 3. Stage all files
    console.log('Staging files...');
    const globby = (await import('globby')).globby;
    const paths = await globby(['**/*', '!.git', '!node_modules', '!dist'], { cwd: dir, dot: true });
    
    for (const filepath of paths) {
      await git.add({ fs, dir, filepath });
    }

    // 4. Commit
    console.log('Committing changes...');
    await git.commit({
      fs,
      dir,
      author: {
        name: 'AI Studio Assistant',
        email: 'ajpwworkemail@gmail.com',
      },
      message: `Feature: Support sorting notes by date and type - ${new Date().toISOString()}`,
    });

    // 5. Push to Staging
    console.log(`Pushing to ${branch} branch...`);
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: branch,
      force: true,
      onAuth: () => ({ username: token }),
      url: repoUrl
    });

    if (pushResult.ok) {
      console.log('✅ Successfully pushed to staging branch!');
    } else {
      console.error('❌ Push failed:', pushResult);
    }
  } catch (error) {
    console.error('❌ Error during push:', error);
    process.exit(1);
  }
}

sync();
