import { Component, ViewChild, ElementRef, ComponentFactoryResolver, Injector, ApplicationRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { PagesService } from 'src/app/core/services/pages.service';
import { ExampleViewerComponent } from 'src/app/shared/components/example-viewer/example-viewer.component';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss']
})
export class ComponentsComponent implements AfterViewInit {
  @ViewChild('docContent') docWrapper: ElementRef;
  @ViewChild('apiDocWrapper') apiDocWrapper: ElementRef;

  constructor(
    private app: ApplicationRef,
    private injector: Injector,
    private pagesService: PagesService,
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit() {
    this.route.params
      .pipe(
        flatMap((data) => this.pagesService.getComponentDocumentation(data.componentName))
      )
      .subscribe((component) => {
        this.docWrapper.nativeElement.innerHTML = `${component.htmlContent}`;
        this.apiDocWrapper.nativeElement.innerHTML = component.apiHtmlContent;
        this.detectDemos(component.htmlContent);
      });
  }

  private detectDemos(htmlCode: string) {
    const fakeNode = document.createElement('div');
    fakeNode.innerHTML = htmlCode;
    const demos = fakeNode.querySelectorAll('[demo]');

    demos.forEach((item) => {
      const demoIdentifier = item.getAttribute('demo');
      const demoNodeDOM = this.docWrapper.nativeElement.querySelector(`[demo="${demoIdentifier}"]`);
      this.addDynamicExampleViewerComponent(item.innerHTML.trim(), demoNodeDOM);
    });
  }

  private addDynamicExampleViewerComponent(codeSource: string, domNodeRef: HTMLElement) {
    const factory: any = this.resolver.resolveComponentFactory(ExampleViewerComponent);
    const ref = factory.create(this.injector, [], domNodeRef);
    ref.instance.content = codeSource;
    this.app.attachView(ref.hostView);
 }

}
