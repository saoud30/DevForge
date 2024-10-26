import { Template } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

export default function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choose a Template</label>
      <Select onValueChange={(value) => {
        const template = templates.find(t => t.id === value);
        if (template) onSelect(template);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              <div>
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-muted-foreground">{template.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}