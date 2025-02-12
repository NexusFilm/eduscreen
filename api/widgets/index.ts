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
        const { class_id } = req.query;
        if (!class_id) {
          return res.status(400).json({ error: 'Class ID is required' });
        }

        const { data: widgets, error } = await supabase
          .from('widgets')
          .select(`
            *,
            notes (*)
          `)
          .eq('class_id', class_id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return res.status(200).json(widgets);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const { class_id, type, label, position, size, is_core, settings } = req.body;

        const { data: widget, error } = await supabase
          .from('widgets')
          .insert([{
            class_id,
            type,
            label,
            position,
            size,
            is_core,
            settings
          }])
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json(widget);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const updates = req.body;

        const { data: widget, error } = await supabase
          .from('widgets')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(widget);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const { id } = req.query;

        // Delete associated notes first
        await supabase
          .from('notes')
          .delete()
          .eq('widget_id', id);

        // Delete the widget
        const { error } = await supabase
          .from('widgets')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ message: 'Widget deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 