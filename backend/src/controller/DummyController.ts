import { Request, Response } from "express";

export class DummyController {
  // GET dummy data
  static async getDummyData(req: Request, res: Response) {
    console.log("🔥 Backend: GET /api/dummy endpoint hit!");
    console.log("📝 Backend: Request headers:", req.headers);
    console.log("🔍 Backend: Query params:", req.query);
    
    const dummyData = {
      id: Math.floor(Math.random() * 1000),
      message: "Hello from the backend!",
      timestamp: new Date().toISOString(),
      randomNumber: Math.floor(Math.random() * 100),
      items: [
        { id: 1, name: "Item 1", value: "Value 1" },
        { id: 2, name: "Item 2", value: "Value 2" },
        { id: 3, name: "Item 3", value: "Value 3" }
      ]
    };

    console.log("📤 Backend: Sending response:", dummyData);
    
    res.status(200).json({
      success: true,
      data: dummyData,
      message: "Dummy data retrieved successfully"
    });
  }

  // POST dummy data
  static async createDummyData(req: Request, res: Response) {
    console.log("🔥 Backend: POST /api/dummy endpoint hit!");
    console.log("📝 Backend: Request body:", req.body);
    console.log("📝 Backend: Request headers:", req.headers);

    const receivedData = req.body;
    const responseData = {
      id: Math.floor(Math.random() * 1000),
      receivedData,
      processedAt: new Date().toISOString(),
      status: "processed",
      message: "Data received and processed successfully"
    };

    console.log("📤 Backend: Sending response:", responseData);

    res.status(201).json({
      success: true,
      data: responseData,
      message: "Dummy data created successfully"
    });
  }

  // PUT dummy data
  static async updateDummyData(req: Request, res: Response) {
    console.log("🔥 Backend: PUT /api/dummy/:id endpoint hit!");
    console.log("📝 Backend: Request params:", req.params);
    console.log("📝 Backend: Request body:", req.body);

    const { id } = req.params;
    const updateData = req.body;

    const responseData = {
      id: parseInt(id),
      ...updateData,
      updatedAt: new Date().toISOString(),
      previousValue: "Some previous value",
      message: `Dummy data with ID ${id} updated successfully`
    };

    console.log("📤 Backend: Sending response:", responseData);

    res.status(200).json({
      success: true,
      data: responseData,
      message: "Dummy data updated successfully"
    });
  }

  // DELETE dummy data
  static async deleteDummyData(req: Request, res: Response) {
    console.log("🔥 Backend: DELETE /api/dummy/:id endpoint hit!");
    console.log("📝 Backend: Request params:", req.params);

    const { id } = req.params;

    const responseData = {
      id: parseInt(id),
      deletedAt: new Date().toISOString(),
      message: `Dummy data with ID ${id} deleted successfully`
    };

    console.log("📤 Backend: Sending response:", responseData);

    res.status(200).json({
      success: true,
      data: responseData,
      message: "Dummy data deleted successfully"
    });
  }
}
