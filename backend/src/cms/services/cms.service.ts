import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalSettingEntity } from '../../entities/global-setting.entity';
import { VlogEntity } from '../entities/vlog.entity';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(GlobalSettingEntity)
    private readonly settingsRepo: Repository<GlobalSettingEntity>,
    @InjectRepository(VlogEntity)
    private readonly vlogRepo: Repository<VlogEntity>,
    @InjectRepository(BlogEntity)
    private readonly blogRepo: Repository<BlogEntity>,
  ) {}

  async getSettings() {
    let settings = await this.settingsRepo.findOne({
      where: { configName: 'default' },
    });

    const defaultPermissions = {
      '/admin/dashboard': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'finance_admin',
        'growth_admin',
        'support_admin',
        'operations_admin',
        'onboarding_admin',
        'content_admin',
      ],
      '/admin/system': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'content_admin',
      ],
      '/admin/users': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'growth_admin',
        'support_admin',
      ],
      '/admin/vendors': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'onboarding_admin',
        'operations_admin',
        'support_admin',
      ],
      '/admin/trips': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'operations_admin',
        'content_admin',
      ],
      '/admin/bookings': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'finance_admin',
        'operations_admin',
        'support_admin',
      ],
      '/admin/finance': ['super_admin', 'tech_admin', 'finance_admin'],
      '/admin/messaging': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'growth_admin',
        'support_admin',
      ],
      '/admin/content': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'content_admin',
        'growth_admin',
      ],
      '/admin/profile': [
        'super_admin',
        'tech_admin',
        'platform_admin',
        'finance_admin',
        'growth_admin',
        'support_admin',
        'operations_admin',
        'onboarding_admin',
        'content_admin',
      ],
    };

    const defaultCreatorSpotlight = [
      {
        name: 'Arjun Mehta',
        handle: '@mountainarjun',
        specialty: 'High Altitude Treks',
        trips: 48,
        subs: '240K',
        avatar: 'A',
        cover: 'from-blue-900 to-indigo-950',
      },
      {
        name: 'Priya Coastal',
        handle: '@priyacoastal',
        specialty: 'Beach & Island Life',
        trips: 62,
        subs: '380K',
        avatar: 'P',
        cover: 'from-teal-900 to-cyan-950',
      },
      {
        name: 'Raj Explorer',
        handle: '@rajexplores',
        specialty: 'Heritage & Culture',
        trips: 35,
        subs: '165K',
        avatar: 'R',
        cover: 'from-amber-900 to-orange-950',
      },
    ];

    if (!settings) {
      settings = this.settingsRepo.create({
        configName: 'default',
        adminModulePermissions: defaultPermissions,
        creatorSpotlight: defaultCreatorSpotlight,
      });
      await this.settingsRepo.save(settings);
    } else {
      // Force update the permissions to ensure they perfectly match the new role spec
      settings.adminModulePermissions = defaultPermissions;
      if (!settings.creatorSpotlight) {
        settings.creatorSpotlight = defaultCreatorSpotlight;
      }
      await this.settingsRepo.save(settings);
    }

    return settings;
  }

  async updateSettings(data: Partial<GlobalSettingEntity>) {
    const settings = await this.getSettings();
    await this.settingsRepo.update(settings.id, data);
    return this.getSettings();
  }

  // ============================
  // Vlog Methods (DB-backed)
  // ============================
  async getVlogs(grouped?: boolean) {
    const vlogs = await this.vlogRepo.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
    if (grouped) {
      const groupedData: Record<string, VlogEntity[]> = {};
      for (const vlog of vlogs) {
        if (!groupedData[vlog.category]) {
          groupedData[vlog.category] = [];
        }
        groupedData[vlog.category].push(vlog);
      }
      return groupedData;
    }
    return vlogs;
  }

  async getVlogById(id: string) {
    const vlog = await this.vlogRepo.findOne({ where: { id } });
    if (!vlog) throw new NotFoundException('Vlog not found');
    return vlog;
  }

  async createVlog(data: Partial<VlogEntity>) {
    // Auto-set order to end of list
    if (data.order === undefined || data.order === null) {
      const count = await this.vlogRepo.count();
      data.order = count;
    }
    const vlog = this.vlogRepo.create(data);
    return this.vlogRepo.save(vlog);
  }

  async updateVlog(id: string, data: Partial<VlogEntity>) {
    const vlog = await this.getVlogById(id);
    Object.assign(vlog, data);
    return this.vlogRepo.save(vlog);
  }

  async deleteVlog(id: string) {
    const vlog = await this.getVlogById(id);
    await this.vlogRepo.remove(vlog);
    return true;
  }

  async reorderVlogs(orders: { id: string; order: number }[]) {
    for (const item of orders) {
      await this.vlogRepo.update(item.id, { order: item.order });
    }
    return this.getVlogs();
  }

  // ============================
  // Blog Methods (DB-backed)
  // ============================
  async getBlogs(onlyPublished = false) {
    const where = onlyPublished ? { isPublished: true } : {};
    return this.blogRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getBlogBySlug(slug: string) {
    const blog = await this.blogRepo.findOne({ where: { slug } });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async getBlogById(id: string) {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async createBlog(data: Partial<BlogEntity>) {
    // Auto-generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    // Set publishedAt if published
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const blog = this.blogRepo.create(data);
    return this.blogRepo.save(blog);
  }

  async updateBlog(id: string, data: Partial<BlogEntity>) {
    const blog = await this.getBlogById(id);
    // Set publishedAt when transitioning to published
    if (data.isPublished && !blog.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    Object.assign(blog, data);
    return this.blogRepo.save(blog);
  }

  async deleteBlog(id: string) {
    const blog = await this.getBlogById(id);
    await this.blogRepo.remove(blog);
    return true;
  }
}
