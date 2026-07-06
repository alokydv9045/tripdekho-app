import { Controller, Get, Put, Body } from '@nestjs/common';
import { CmsService } from '../services/cms.service';
import { GlobalSettingEntity } from '../../entities/global-setting.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { UpdateGlobalSettingsDto } from '../dto/cms.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN)
@Controller('admin/settings')
export class AdminCmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async getSettings() {
    return this.cmsService.getSettings();
  }

  @Put()
  async updateSettings(@Body() body: UpdateGlobalSettingsDto) {
    return this.cmsService.updateSettings(body);
  }
}
