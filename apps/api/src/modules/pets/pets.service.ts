import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SIZE_MAP: Record<string, string> = {
  pequeno: 'pequeno', medio: 'medio', grande: 'grande', gigante: 'gigante',
  small: 'pequeno', medium: 'medio', large: 'grande', giant: 'gigante',
  p: 'pequeno', m: 'medio', g: 'grande',
};

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  findByClient(clientId: string) {
    return this.prisma.pet.findMany({ where: { clientId } });
  }

  create(data: any) {
    const rawSize = data.size as string | undefined;
    const size = rawSize ? SIZE_MAP[rawSize.toLowerCase()] : 'medio';
    if (rawSize && !size) {
      throw new BadRequestException(
        `Porte inválido: "${rawSize}". Valores aceitos: pequeno, medio, grande, gigante`,
      );
    }
    return this.prisma.pet.create({ data: { ...data, size } });
  }
}
