import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../src/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { widget_id } = req.query;
        if (!widget_id) {
          return res.status(400).json({ error: 'Widget ID is required' });
        }

        const { data: notes, error } = await supabase
          .from('notes')
          .select('*')
          .eq('widget_id', widget_id)
          .order('position', { ascending: true });

        if (error) throw error;
        return res.status(200).json(notes);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const { widget_id, content, color, position } = req.body;

        const { data: note, error } = await supabase
          .from('notes')
          .insert([{
            widget_id,
            content,
            color,
            position
          }])
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json(note);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const updates = req.body;

        // Add updated_at timestamp
        updates.updated_at = new Date().toISOString();

        const { data: note, error } = await supabase
          .from('notes')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(note);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const { id } = req.query;

        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ message: 'Note deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 