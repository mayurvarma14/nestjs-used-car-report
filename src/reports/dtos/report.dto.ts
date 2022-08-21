import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  price: number;

  // @Transform(({ obj }) =>
  //   typeof obj.user === 'number' ? obj.user : obj.user.id,
  // )
  // @Expose()
  // userId: number;

  @Expose()
  approved: boolean;
}
