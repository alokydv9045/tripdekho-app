import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateReviewStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['approved', 'rejected', 'pending', 'flagged'])
  status: string;
}
