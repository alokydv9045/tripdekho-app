import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CmsService } from '../services/cms.service';
import { 
  CreateVibeVideoDto, 
  UpdateVibeVideoDto, 
  ReorderVibeVideosDto, 
  CreateVlogDto, 
  UpdateVlogDto, 
  CreateBlogDto, 
  UpdateBlogDto, 
  CreateDestinationDto, 
  UpdateDestinationDto, 
  UpdateGlobalSettingsDto 
} from '../dto/cms.dto';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get('settings')
  async getPublicSettings() {
    return this.cmsService.getSettings();
  }

  @Public()
  @Get('destinations')
  async getDestinations(@Query('type') type: string = 'destination') {
    // Static destination/pickup city data — will be moved to DB when admin CMS is built
    const destinations = [
      {
        id: 'delhi',
        label: 'Delhi',
        value: 'delhi',
        icon: 'Landmark',
        isNewlyAdded: false,
      },
      {
        id: 'gurgaon',
        label: 'Gurgaon',
        value: 'gurgaon',
        icon: 'Building2',
        isNewlyAdded: false,
      },
      {
        id: 'noida',
        label: 'Noida',
        value: 'noida',
        icon: 'Building2',
        isNewlyAdded: false,
      },
      {
        id: 'ghaziabad',
        label: 'Ghaziabad',
        value: 'ghaziabad',
        icon: 'Landmark',
        isNewlyAdded: false,
      },
      {
        id: 'mumbai',
        label: 'Mumbai',
        value: 'mumbai',
        icon: 'Landmark',
        isNewlyAdded: false,
      },
      {
        id: 'pune',
        label: 'Pune',
        value: 'pune',
        icon: 'MapPin',
        isNewlyAdded: false,
      },
      {
        id: 'hyderabad',
        label: 'Hyderabad',
        value: 'hyderabad',
        icon: 'Landmark',
        isNewlyAdded: false,
      },
      {
        id: 'bangalore',
        label: 'Bangalore',
        value: 'bangalore',
        icon: 'Compass',
        isNewlyAdded: false,
      },
      {
        id: 'chennai',
        label: 'Chennai',
        value: 'chennai',
        icon: 'Waves',
        isNewlyAdded: true,
      },
      {
        id: 'jaipur',
        label: 'Jaipur',
        value: 'jaipur',
        icon: 'Landmark',
        isNewlyAdded: true,
      },
      {
        id: 'chandigarh',
        label: 'Chandigarh',
        value: 'chandigarh',
        icon: 'TreePine',
        isNewlyAdded: true,
      },
      {
        id: 'ahmedabad',
        label: 'Ahmedabad',
        value: 'ahmedabad',
        icon: 'Landmark',
        isNewlyAdded: true,
      },
      {
        id: 'lucknow',
        label: 'Lucknow',
        value: 'lucknow',
        icon: 'Landmark',
        isNewlyAdded: true,
      },
      {
        id: 'kolkata',
        label: 'Kolkata',
        value: 'kolkata',
        icon: 'Landmark',
        isNewlyAdded: true,
      },
      {
        id: 'navi-mumbai',
        label: 'Navi Mumbai',
        value: 'navi-mumbai',
        icon: 'Building2',
        isNewlyAdded: false,
      },
      {
        id: 'thane',
        label: 'Thane',
        value: 'thane',
        icon: 'MapPin',
        isNewlyAdded: false,
      },
      {
        id: 'greater-noida',
        label: 'Greater Noida',
        value: 'greater-noida',
        icon: 'Building2',
        isNewlyAdded: false,
      },
      {
        id: 'faridabad',
        label: 'Faridabad',
        value: 'faridabad',
        icon: 'Building2',
        isNewlyAdded: true,
      },
    ];

    // For pickup type, return a subset of major cities
    if (type === 'pickup') {
      const pickupCities = [
        'delhi',
        'mumbai',
        'bangalore',
        'hyderabad',
        'pune',
        'chennai',
        'kolkata',
        'jaipur',
        'chandigarh',
        'lucknow',
      ];
      return {
        success: true,
        data: destinations.filter((d) => pickupCities.includes(d.id)),
      };
    }

    return { success: true, data: destinations };
  }

  // ============================
  // Blogs — DB-backed
  // ============================
  @Public()
  @Get('blogs')
  async getBlogs(@Query('limit') limit: number = 10) {
    const blogs = await this.cmsService.getBlogs(true); // only published for public
    return { success: true, data: blogs.slice(0, limit) };
  }

  @Get('blogs/admin/all')
  async getAllBlogsAdmin() {
    const blogs = await this.cmsService.getBlogs(false); // all blogs for admin
    return { success: true, data: blogs };
  }

  @Public()
  @Get('blogs/:slug')
  async getBlogBySlug(@Param('slug') slug: string) {
    try {
      const blog = await this.cmsService.getBlogBySlug(slug);
      return { success: true, data: blog };
    } catch {
      return { success: false, message: 'Blog not found' };
    }
  }

  // ============================
  // Vibe Videos — DB-backed (uses VlogEntity)
  // ============================
  @Public()
  @Get('vibe-videos')
  async getVibeVideos(@Query('homepageOnly') homepageOnly: boolean) {
    // Vibe videos are vlogs ordered by their arrangement
    const vlogs = await this.cmsService.getVlogs();
    const data = (vlogs as any[]).filter((v: any) => v.isActive);
    return { success: true, data };
  }

  @Public()
  @Get('vlogs')
  async getVlogs(@Query('grouped') grouped?: string) {
    const isGrouped = grouped === 'true' || grouped === '1';
    const data = await this.cmsService.getVlogs(isGrouped);
    return { success: true, data };
  }

  @Public()
  @Get('vlogs/categories')
  async getVlogCategories() {
    return { success: true, data: ['Adventure', 'Culture', 'Relaxation', 'Nature', 'Spiritual', 'Beach', 'Mountain'] };
  }

  // --- Vibe Videos Write Operations (DB-backed) ---
  @Post('vibe-videos')
  @HttpCode(HttpStatus.CREATED)
  async createVibeVideo(@Body() body: CreateVibeVideoDto) {
    const data = await this.cmsService.createVlog({
      title: body.title || 'Untitled Reel',
      instagramUrl: body.instagramUrl,
      thumbnail: body.thumbnail,
      location: body.location,
      order: body.order,
      isActive: true,
      isFeatured: false,
    });
    return { success: true, data };
  }

  @Put('vibe-videos/reorder')
  async reorderVibeVideos(
    @Body() body: ReorderVibeVideosDto,
  ) {
    const data = await this.cmsService.reorderVlogs(body.orders);
    return { success: true, data };
  }

  @Put('vibe-videos/:id')
  async updateVibeVideo(@Param('id') id: string, @Body() body: UpdateVibeVideoDto) {
    const data = await this.cmsService.updateVlog(id, body as any);
    return { success: true, data };
  }

  @Delete('vibe-videos/:id')
  async deleteVibeVideo(@Param('id') id: string) {
    await this.cmsService.deleteVlog(id);
    return { success: true, message: `Vibe video ${id} deleted successfully` };
  }

  // --- Vlogs Write Operations ---
  @Post('vlogs')
  @HttpCode(HttpStatus.CREATED)
  async createVlog(@Body() body: CreateVlogDto) {
    const data = await this.cmsService.createVlog(body);
    return { success: true, data };
  }

  @Put('vlogs/:id')
  async updateVlog(@Param('id') id: string, @Body() body: UpdateVlogDto) {
    const data = await this.cmsService.updateVlog(id, body);
    return { success: true, data };
  }

  @Delete('vlogs/:id')
  async deleteVlog(@Param('id') id: string) {
    await this.cmsService.deleteVlog(id);
    return { success: true, message: `Vlog ${id} deleted successfully` };
  }

  // --- Blogs Write Operations (DB-backed) ---
  @Post('blogs')
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() body: CreateBlogDto) {
    const data = await this.cmsService.createBlog(body);
    return { success: true, data };
  }

  @Put('blogs/:id')
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    const data = await this.cmsService.updateBlog(id, body);
    return { success: true, data };
  }

  @Delete('blogs/:id')
  async deleteBlog(@Param('id') id: string) {
    await this.cmsService.deleteBlog(id);
    return { success: true, message: `Blog ${id} deleted successfully` };
  }

  // --- Destinations Write Operations ---
  @Post('destinations')
  @HttpCode(HttpStatus.CREATED)
  async createDestination(@Body() body: CreateDestinationDto) {
    return {
      success: true,
      data: {
        id: 'new-destination-' + Math.random().toString(36).substr(2, 9),
        ...body,
      },
    };
  }

  @Put('destinations/:id')
  async updateDestination(@Param('id') id: string, @Body() body: UpdateDestinationDto) {
    return { success: true, data: { id, ...body } };
  }

  @Delete('destinations/:id')
  async deleteDestination(@Param('id') id: string) {
    return { success: true, message: `Destination ${id} deleted successfully` };
  }

  // --- Global Settings Write Operations ---
  @Put('settings')
  async updateSettings(@Body() body: UpdateGlobalSettingsDto) {
    const data = await this.cmsService.updateSettings(body);
    return { success: true, data };
  }
}
