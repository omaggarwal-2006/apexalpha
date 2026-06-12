import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import vm from 'vm';

const router = Router();

router.post('/execute', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { script, currentPrice, balance } = req.body;
    
    if (!script) {
      return res.status(400).json({ error: 'No script provided.' });
    }

    let action = 'HOLD';
    let logs: string[] = [];

    // Define the sandbox context
    const sandbox = {
      price: currentPrice || 0,
      balance: balance || 0,
      buy: () => { action = 'BUY'; },
      sell: () => { action = 'SELL'; },
      log: (msg: any) => { logs.push(String(msg)); }
    };

    // Create a context and execute the script safely
    vm.createContext(sandbox);
    
    try {
      // Set a timeout to prevent infinite loops
      const scriptCode = new vm.Script(script);
      scriptCode.runInContext(sandbox, { timeout: 1000 });
    } catch (vmError: any) {
      return res.status(400).json({ error: 'Script Error: ' + vmError.message, logs });
    }

    res.json({ success: true, action, logs });
  } catch (error: any) {
    res.status(500).json({ error: 'Agent execution failed: ' + error.message });
  }
});

export default router;
