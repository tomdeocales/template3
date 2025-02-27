import type { Request, Response } from "express";

export function getSample(req: Request, res: Response): void {
  res.send({ message: "All sample fetched!" });
}

export function getSampleById(req: Request, res: Response): void {
  const sampleId: string = req.params.id;
  res.send({ message: `Sample ${sampleId} fetched!` });
}

export function createSample(req: Request, res: Response): void {
  const sampleData: { name?: string } = req.body; // Define expected shape of request body
  res.send({ message: "Sample created!", data: sampleData });
}

export function deleteSample(req: Request, res: Response): void {
  const sampleId: string = req.params.id;
  res.send({ message: `Sample ${sampleId} deleted!` });
}
