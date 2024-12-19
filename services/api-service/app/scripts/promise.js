import { PromiseDao } from '@dao/promise/promise';
import { PromiseCategoryDao } from '@dao/promise/promise-category';
import log from '@utils/log';
import fs from 'fs';
import path from 'path';

const importPromises = async () => {
    try {
        const promisesDir = path.join(__dirname, '../', 'public/promises-new');

        const files = fs.readdirSync(promisesDir);

        for (const file of files) {
            // Skip non-JSON files and system files
            if (!file.endsWith('.json') || file.startsWith('.')) continue;

            // Extract category name from filename
            const categoryName = file
                .replace(/^\d+_/, '') // Remove number prefix
                .replace(/\.json$/, '') // Remove .json extension
                .replace(/…+/, ''); // Remove any ellipsis

            // Read and parse the JSON file
            const filePath = path.join(promisesDir, file);
            const promises = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Create category using DAO
            let category;
            try {
                category = await PromiseCategoryDao.create({
                    name: categoryName,
                    is_published: true,
                });

                log.verbose(`Created category: ${categoryName}`);
            } catch (err) {
                // Skip if category already exists
                if (err.code === 'ER_DUP_ENTRY') {
                    log.warn(
                        `Category "${categoryName}" already exists, skipping...`,
                    );
                    continue;
                }
                throw err;
            }

            // Create promises for this category using DAO
            let successCount = 0;
            for (const promise of promises) {
                // Split into chapter and text
                const match = promise.match(/^([^：\s]+)\s+(.+)$/);
                if (!match) {
                    log.warn(`Invalid promise format in ${file}: ${promise}`);
                    continue;
                }

                const [, chapter, text] = match;

                try {
                    await PromiseDao.create({
                        category_id: category.id,
                        chapter,
                        text,
                        is_published: true,
                    });
                    successCount++;
                } catch (err) {
                    log.error(
                        `Error creating promise in ${file}: ${promise}`,
                        err,
                    );
                }
            }

            log.verbose(
                `Imported ${successCount}/${promises.length} promises for category "${categoryName}"`,
            );
        }

        log.verbose('Promise data import completed successfully');
    } catch (error) {
        log.error('Error importing promise data:', error);
        throw error;
    }
};

export default {
    importPromises,
};
