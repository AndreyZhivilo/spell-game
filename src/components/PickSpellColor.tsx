import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer.tsx"

import { Label } from "./ui/label.tsx"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.tsx"

import { Button } from "./ui/button.tsx"
import { IColor } from "../types/index.ts"

export function PickSpellColor({
  open,
  onClose,
  items,
  current,
  onSelect
}: {
  open: boolean,
  onClose: () => void
  items: IColor[]
  current: string
  onSelect: (color: string) => void
}) {
  return (
    <Drawer open={open}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Выбирите цвет заклинания</DrawerTitle>
          <DrawerDescription>
            <RadioGroup defaultValue={current} onValueChange={onSelect}>
              {items.map(item => (
                <div className="flex items-center space-x-2" key={item.name}>
                  <RadioGroupItem value={item.name} id={item.name} />
                  <Label htmlFor={item.name}>{item.label}</Label>
                </div>)
              )}
            </RadioGroup>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button onClick={onClose} variant="outline">Готово!</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>)
}