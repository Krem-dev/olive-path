import { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { Devotion, Sermon, QAItem } from '../models';
import { success, paginated } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

// ── Devotions ──

export async function getTodayDevotion(_req: Request, res: Response): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  let devotion = await Devotion.findOne({
    where: { date: today, isActive: true },
  });

  // Fallback to most recent devotion if none for today
  if (!devotion) {
    devotion = await Devotion.findOne({
      where: { isActive: true },
      order: [['date', 'DESC']],
    });
  }

  if (!devotion) {
    throw new AppError('No devotion available', 404);
  }

  success(res, devotion);
}

export async function getDevotions(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await Devotion.findAndCountAll({
    where: { isActive: true },
    order: [['date', 'DESC']],
    limit,
    offset,
  });

  paginated(res, rows, count, page, limit);
}

// ── Sermons ──

export async function getSermons(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { category, contentType, search, sort } = req.query;

  const conditions: WhereOptions[] = [{ isActive: true }];

  if (category && ['preaching', 'motivation'].includes(category as string)) {
    conditions.push({ category } as WhereOptions);
  }

  if (contentType && ['video', 'audio', 'reading'].includes(contentType as string)) {
    conditions.push({ contentType } as WhereOptions);
  }

  if (search) {
    conditions.push({
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { scripture: { [Op.like]: `%${search}%` } },
        { summary: { [Op.like]: `%${search}%` } },
      ],
    } as WhereOptions);
  }

  const where: WhereOptions = { [Op.and]: conditions };

  let order: [string, string][] = [['published_at', 'DESC']];
  if (sort === 'popular') order = [['view_count', 'DESC']];
  if (sort === 'title') order = [['title', 'ASC']];

  const { count, rows } = await Sermon.findAndCountAll({
    where,
    order,
    limit,
    offset,
  });

  paginated(res, rows, count, page, limit);
}

export async function getSermonById(req: Request, res: Response): Promise<void> {
  const sermon = await Sermon.findByPk(parseInt(req.params.id as string, 10));

  if (!sermon || !sermon.isActive) {
    throw new AppError('Sermon not found', 404);
  }

  // Increment view count
  await sermon.increment('viewCount');

  success(res, sermon);
}

export async function getRecentSermons(_req: Request, res: Response): Promise<void> {
  const sermons = await Sermon.findAll({
    where: { isActive: true },
    order: [['published_at', 'DESC']],
    limit: 10,
  });

  success(res, sermons);
}

// ── Q&A ──

export async function getQAItems(req: Request, res: Response): Promise<void> {
  const { category, search } = req.query;

  const conditions: WhereOptions[] = [{ isActive: true }];

  if (category && category !== 'All') {
    conditions.push({ category } as WhereOptions);
  }

  if (search) {
    conditions.push({
      [Op.or]: [
        { question: { [Op.like]: `%${search}%` } },
        { answer: { [Op.like]: `%${search}%` } },
      ],
    } as WhereOptions);
  }

  const items = await QAItem.findAll({
    where: { [Op.and]: conditions },
    order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
  });

  success(res, items);
}

export async function getQACategories(_req: Request, res: Response): Promise<void> {
  const categories = await QAItem.findAll({
    attributes: ['category'],
    where: { isActive: true },
    group: ['category'],
    order: [['category', 'ASC']],
  });

  success(res, categories.map((c) => c.category));
}
