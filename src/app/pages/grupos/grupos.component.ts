import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group } from 'src/app/models/Group';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {
  @Input() groups: Group[] = [];
  @Output() close = new EventEmitter<any>(); 
  id?:number;
  name:string='';
  
  save(){
    if(this.id){
      this.update();
    }
    else{
      this.create();
    }
    this.clean();
  }
  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  create(){
    let group:Group={
      id:this.generateRandomNumber(0,100),
      name:this.name,
    }
    this.groups.push({...group})
  }
  update(){
    const index = this.groups.findIndex(c => c.id === this.id);
    if (index >= 0 && index < this.groups.length) {
      let group:Group={
        id:this.id,
        name:this.name,
      }
      this.groups[index]=({...group})
    }
  }
  clean(){
    this.id=undefined;
    this.name='';
  }
  editItem(id?:number){
    const contact=this.groups.find(group => group.id === id);
    if(contact){
      this.id=contact!.id;
      this.name=contact!.name||'';
    }
  }
  deleteItem(id?:number){
    const index = this.groups.findIndex(g => g.id === id);
    if (index >= 0 && index < this.groups.length) {
      this.groups.splice(index, 1);
    }
    this.clean();
  }
  onClose(): void{
    this.close.emit(this.groups); 
  }
}
