import { Request, Response } from "express";
import { CustomError, CreateCategoryDto } from "../../domain";
import { CategoryService } from '../service/category.service';

export class CategoryController {

  //DI
  constructor(
    private readonly categoryService: CategoryService,
  ){}


  private handleError = (error: unknown, res: Response) => {
    if( error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }

  createCategory = async (req: Request, res: Response) => {
    
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if( error ) return res.status(400).json({ error });
    
    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then( category => res.status(201).json(category) )
      .catch( error => this.handleError(error, res) )
  }

  getCategories = async (req: Request, res: Response) => {

    this.categoryService.getCategories()
      .then( categories => res.json( categories ))
      .catch( error => this.handleError(error, res) )
  }
}